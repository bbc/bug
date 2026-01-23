To test the docs locally you'll need:

- gem
- node
- npm

```
# Install rbenv and ruby-build
brew install rbenv ruby-build

# Initialize rbenv
rbenv init

# Install Ruby 3.2.2 (or newer)
rbenv install 3.2.2

# Set it for your shell
rbenv global 3.2.2

# Verify
ruby -v   # should show 3.2.2
```

run `gem install bundler`

```
gem install bundler
gem install jekyll
gem install jekyll-remote-theme
```

```
cd ..
npm run docs:serve
```
