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

function hashExistsInHistory(hash) {
    try {
        execSync(`git cat-file -e ${hash}^{commit}`, { stdio: 'ignore' })
        return true
    } catch {
        return false
    }
}

console.log(`processing modules for updates ...`)

modules.forEach(moduleName => {
    const modulePath = path.join(modulesBase, moduleName)
    const mdFile = path.join(modulePath, 'CHANGELOG.md')
    const moduleJsonFile = path.join(modulePath, 'module.json')

    console.log(`${moduleName}`)

    // read existing changelog to find last commit hash and date
    let lastCommitHash = null
    let lastCommitDate = null
    let existingContent = ''

    if (fs.existsSync(mdFile)) {
        existingContent = fs.readFileSync(mdFile, 'utf-8')

        // extract full hash from the first commit URL in the most recent version entry
        const hashMatch = existingContent.match(
            /### version [\d.]+[\s\S]*?\/commit\/([0-9a-f]{40})/
        )
        if (hashMatch) lastCommitHash = hashMatch[1]

        // extract the most recent date as a fallback
        const dateMatch = existingContent.match(
            /### version [\d.]+[\s\S]*?- (\d{4}-\d{2}-\d{2}):/
        )
        if (dateMatch) lastCommitDate = dateMatch[1]
    }

    // build git log range argument - with fallback if hash no longer exists
    let rangeArg = ''
    if (lastCommitHash) {
        if (hashExistsInHistory(lastCommitHash)) {
            rangeArg = `${lastCommitHash}..HEAD`
            console.log(` - resuming from commit ${lastCommitHash.slice(0, 7)}`)
        } else if (lastCommitDate) {
            rangeArg = `--after="${lastCommitDate}"`
            console.log(` - hash ${lastCommitHash.slice(0, 7)} not found (squashed?), falling back to date ${lastCommitDate}`)
        } else {
            console.log(` - hash not found and no date fallback, processing all commits`)
        }
    }

    // fetch new commits for this module
    let gitLog = ''
    try {
        gitLog = execSync(
            `git log --pretty=format:"%H|%ad|%s" --date=short ${rangeArg} -- src/modules/${moduleName}`,
            { encoding: 'utf-8' }
        )
        console.log(` - found ${gitLog.split('\n').length} total commit(s) in git`)
    } catch (err) {
        console.log(` - no new commits`)
        return
    }

    if (!gitLog.trim()) {
        console.log(` - no new commits`)
        return
    }

    // collect existing commit descriptions to deduplicate against
    const existingDescriptions = new Set(
        [...existingContent.matchAll(/^- \d{4}-\d{2}-\d{2}: (.+?) \(\[/gm)].map(m => m[1])
    )

    // parse commits for this module
    const commits = gitLog.split('\n')
        .map(line => {
            const [hash, date, message] = line.split('|')
            const match = message.match(/^\[(.+?)\]\s*(.+)$/)
            if (!match || match[1] !== moduleName) return null
            return { hash, date, description: match[2] }
        })
        .filter(Boolean)
        .filter(c => {
            if (existingDescriptions.has(c.description)) {
                console.log(` - skipping duplicate: ${c.description}`)
                return false
            }
            return true
        })

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