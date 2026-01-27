#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

// base path for modules
const modulesBase = 'src/modules'
const GITHUB_REPO = 'https://github.com/bbc/bug'

// get all module folders
const modules = fs.readdirSync(modulesBase).filter(f =>
    fs.statSync(path.join(modulesBase, f)).isDirectory()
)

console.log(`processing modules for updates ...`)

modules.forEach(moduleName => {
    const modulePath = path.join(modulesBase, moduleName)
    const mdFile = path.join(modulePath, 'CHANGELOG.md')
    const moduleJsonFile = path.join(modulePath, 'module.json')

    console.log(`${moduleName}`)

    // read existing changelog.md to find last commit
    let lastCommitHash = null
    let existingContent = ''
    if (fs.existsSync(mdFile)) {
        existingContent = fs.readFileSync(mdFile, 'utf-8')
        const match = existingContent.match(/\[([0-9a-f]{7})\]\(https?:\/\/github\.com\/[^)]+\/commit\/[0-9a-f]{7,40}\)/)
        if (match) lastCommitHash = match[1]
    }

    // fetch new commits for this module
    let gitLog = ''
    try {
        gitLog = execSync(
            `git log --pretty=format:"%H|%ad|%s" --date=short ${lastCommitHash ? lastCommitHash + '..HEAD' : ''} -- src/modules/${moduleName}`,
            { encoding: 'utf-8' }
        );
        console.log(` - found ${gitLog.split('\n').length} total commit(s) in git`)
    } catch (err) {
        console.log(` - no new commits`)
        return
    }

    if (!gitLog.trim()) {
        console.log(` - no new commits`)
        return
    }

    // parse commits for this module
    const commits = gitLog.split('\n')
        .map(line => {
            const [hash, date, message] = line.split('|')
            const match = message.match(/^\[(.+?)\]\s*(.+)$/)
            if (!match || match[1] !== moduleName) return null
            return { hash, date, description: match[2] }
        })
        .filter(Boolean)

    if (!commits.length) {
        console.log(` - no new commits to process`)
        return
    }

    console.log(` - found ${commits.length} commit(s) to process`)

    // read module.json and bump version
    if (!fs.existsSync(moduleJsonFile)) {
        console.log(` - no module.json for ${moduleName}, skipping`)
        return
    }

    const moduleData = JSON.parse(fs.readFileSync(moduleJsonFile, 'utf-8'))

    // split version into parts and increment patch
    let [major, minor, patch] = (moduleData.version || '0.0.0').split('.').map(Number)
    const oldVersion = moduleData.version
    patch += 1
    moduleData.version = `${major}.${minor}.${patch}`

    // only write back if version changed
    if (moduleData.version !== oldVersion) {
        console.log(` - bumping version ${oldVersion} -> ${moduleData.version}`)
        fs.writeFileSync(moduleJsonFile, JSON.stringify(moduleData, null, 4))
    } else {
        console.log(` - version unchanged`)
    }

    // build new markdown section for version (with GitHub links)
    let newMd = `### version ${moduleData.version}\n\n`
    commits.sort((a, b) => b.date.localeCompare(a.date)).forEach(c => {
        const shortHash = c.hash.substring(0, 7)
        const commitUrl = `${GITHUB_REPO}/commit/${c.hash}`
        newMd += `- ${c.date}: ${c.description} ([${shortHash}](${commitUrl}))\n`
    })
    newMd += '\n'

    // prepend to existing changelog or create new
    if (!existingContent) existingContent = `## Changelog\n\n`

    existingContent = existingContent.replace(/^## Changelog\s*/i, `## Changelog\n\n${newMd}`)
    fs.writeFileSync(mdFile, existingContent)
    console.log(` - updated changelog.md`)
})

console.log('all module changelogs updated!')
