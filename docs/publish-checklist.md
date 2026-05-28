# Local Verification

```bash
npm run clean
npm install
npm run build
npm run typecheck
npm run test
```

# Package Verification

```bash
cd packages/cli
npm pack
```

# Global Tarball Install Test

```bash
npm install -g ./codemelt-cli-0.1.0.tgz
```

# Verify CLI

```bash
codemelt --help
codemelt --version
codemelt init
codemelt export
```

# Remove Global Test Install

```bash
npm uninstall -g @codemelt/cli
```

# Publish

```bash
npm publish --access public
```
