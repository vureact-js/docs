# Plugins

VuReact provides a flexible plugin system that allows you to inject custom logic at different stages of the compilation process. Plugins can be used to enhance functionality, add metadata, modify output results, and more.

## Plugin System Overview

VuReact's compilation process is divided into three stages, each supporting plugins:

1. **Parse Stage** - Parses Vue SFC source code into a structured AST
2. **Transform Stage** - Converts Vue AST into React Intermediate Representation (IR)
3. **Codegen Stage** - Generates final JSX/TSX code from React IR
4. **Compilation Stage** - Processed results with file paths included

Each stage has a corresponding plugin interface, and you can choose to inject logic at the appropriate stage based on your needs.

## Plugin Type Definitions

### Basic Plugin Interface

```typescript
interface PluginRegister<T> {
  [name: string]: (result: T, ctx: ICompilationContext) => void;
}
```

### Stage-specific Plugin Types

```typescript
// Parse stage plugin
type ParserPlugin = PluginRegister<ParseResult>;

// Transform stage plugin
type TransformerPlugin = PluginRegister<ReactIRDescriptor>;

// Code generation stage plugin
type CodegenPlugin = PluginRegister<GeneratorResult>;

// Compilation completion plugin (executed after all stages)
type CompilationPlugin = PluginRegister<CompilationResult>;
```

## Configuring Plugins

Configure plugins in `vureact.config.js`:

```javascript
import { defineConfig } from '@vureact/compiler-core';

export default defineConfig({
  plugins: {
    // Parse stage plugins
    parser: {
      extractMetadata: (result, ctx) => {
        // Add custom logic during parse stage
      },
    },

    // Transform stage plugins
    transformer: {
      analyzeDependencies: (result, ctx) => {
        // Add custom logic during transform stage
      },
    },

    // Codegen stage plugins
    codegen: {
      formatOutput: (result, ctx) => {
        // Add custom logic during code generation stage
      },
    },

    // Compilation completion plugin (executed after all stages)
    customAnalytics: (result, ctx) => {
      // Execute after compilation is complete
    },
  },
});
```

## Plugin Context

Each plugin receives two parameters:

1. `result` - The processing result of the current stage
2. `ctx` - Compilation context object

### Compilation Context Interface

```typescript
interface ICompilationContext {
  fileId: string; // File ID
  filename: string; // File name
  compName: string; // Component name
  imports: Map<string, ImportItem[]>; // Collected React and VuReact runtime modules to import
  source: string; // Source code
  inputType: 'sfc' | 'script-ts' | 'script-js'; // Input type
  route?: boolean; // Whether routing is used
  // ... other context information
}
```

## Stage-specific Plugin Examples

### 1. Parse Stage Plugin

Parse stage plugins can access the complete parse result of Vue SFC:

```typescript
// Using the plugin
export default defineConfig({
  plugins: {
    parser: {
      // Example: Extract component metadata
      extractComponentInfo: (result: ParseResult, ctx: ICompilationContext) => {
        const { template, script, style } = result;

        // Extract component name
        const componentName = extractNameFromScript(script);

        // Analyze template complexity
        const templateComplexity = analyzeTemplate(template);

        // Check style types
        const hasScopedStyle = style?.source?.scoped || false;
        const hasCSSModules = style?.source?.module || false;

        // Add metadata to the result
        (result as any).metadata = {
          componentName,
          templateComplexity,
          hasScopedStyle,
          hasCSSModules,
          analyzedAt: new Date().toISOString(),
        };
      },
    },
  },
});
```

### 2. Transform Stage Plugin

Transform stage plugins can access the React Intermediate Representation:

```typescript
export default defineConfig({
  plugins: {
    transformer: {
      // Example: Analyze dependencies
      analyzeDependencies: (result: ReactIRDescriptor, ctx: ICompilationContext) => {
        const { script, template } = result;

        // Extract import statements from script
        const imports = extractImports(script);

        // Extract used components from template
        const usedComponents = extractComponentsFromTemplate(template);

        // Analyze runtime dependencies
        const runtimeDeps = analyzeRuntimeDependencies(script);

        // Add dependency analysis results
        (result as any).dependencies = {
          imports,
          usedComponents,
          runtimeDeps,
          totalDeps: imports.length + runtimeDeps.length,
        };
      },

      // Example: Style preprocessing
      processStyles: (result: ReactIRDescriptor, ctx: ICompilationContext) => {
        if (result.style) {
          // Add CSS vendor prefixes
          result.style = addVendorPrefixes(result.style);

          // Minify CSS
          result.style = minifyCSS(result.style);

          // Add source map comment
          result.style += `\n/* Source: ${ctx.filename} */`;
        }
      },
    },
  },
});
```

### 3. Codegen Stage Plugin

Codegen stage plugins can modify the final output code:

```typescript
export default defineConfig({
  plugins: {
    codegen: {
      // Example: Code formatting
      prettify: (result: GeneratorResult, ctx: ICompilationContext) => {
        // Format code with prettier (vureact)
        const formatted = prettier.format(result.code, {
          parser: 'babel',
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
        });

        result.code = formatted;
      },

      // Example: Add file header comment
      addFileHeader: (result: GeneratorResult, ctx: ICompilationContext) => {
        const header = `/** Generated by VuReact */`;
        result.code = header + result.code;
      },

      // Example: Code quality check
      lintGeneratedCode: (result: GeneratorResult, ctx: ICompilationContext) => {
        const issues = eslint.verify(result.code, {
          rules: {
            'react/react-in-jsx-scope': 'off',
            'no-unused-vars': 'warn',
            'no-console': 'warn',
          },
        });

        if (issues.length > 0) {
          console.warn(`Found ${issues.length} lint issues in ${ctx.filename}:`);
          issues.forEach((issue) => {
            console.warn(`  ${issue.line}:${issue.column} ${issue.message}`);
          });
        }
      },
    },
  },
});
```

### 4. Compilation Completion Plugin

Compilation completion plugins execute after all stages and can access the complete compilation result:

```typescript
export default defineConfig({
  plugins: {
    // Add plugin functions directly
    // Example: Compilation statistics
    collectStats: (result: CompilationResult, ctx: ICompilationContext) => {
      const stats = {
        filename: ctx.filename,
        fileSize: ctx.source.length,
        generatedSize: result.code.length,
        hasCSS: !!result.fileInfo.css,
        hasJSX: !!result.fileInfo.jsx,
        hasScript: !!result.fileInfo.script,
      };

      // Save statistics
      saveCompilationStats(stats);

      // Add to result
      (result as any).stats = stats;
    },

    // Example: Send notification
    sendNotification: (result: CompilationResult, ctx: ICompilationContext) => {
      if (process.env.NODE_ENV === 'development') {
        // Send desktop notification in development environment
        new Notification('VuReact Compilation Complete', {
          body: `Successfully compiled ${ctx.filename}`,
          icon: '/path/to/icon.png',
        });
      }

      // Send to monitoring system
      sendToMonitoringSystem({
        event: 'compilation_complete',
        data: (result as any).stats,
        timestamp: new Date().toISOString(),
      });
    },
  },
});
```

## Practical Plugin Examples

> Note: For reference only, do not use directly.

### 1. Performance Analysis Plugin

```typescript
const performancePlugin = {
  measurePerformance: (result: any, ctx: ICompilationContext) => {
    if (!ctx.metrics) ctx.metrics = {};

    const stage = ctx.currentStage; // 'parse', 'transform', 'codegen'
    const duration = Date.now() - ctx.stageStartTime;

    ctx.metrics[stage] = duration;

    if (stage === 'codegen') {
      // All stages completed, output performance report
      console.log(`
VuReact Performance Report for ${ctx.filename}:
  Parse: ${ctx.metrics.parse}ms
  Transform: ${ctx.metrics.transform}ms  
  Codegen: ${ctx.metrics.codegen}ms
  Total: ${Object.values(ctx.metrics).reduce((a, b) => a + b, 0)}ms
      `);
    }
  },
};

// Use the same plugin across all stages
export default defineConfig({
  plugins: {
    parser: { performancePlugin },
    transformer: { performancePlugin },
    codegen: { performancePlugin },
  },
});
```

### 2. Dependency Analysis Plugin

```typescript
const dependencyGraphPlugin = {
  buildDependencyGraph: (result: CompilationResult, ctx: ICompilationContext) => {
    const graph = {
      nodes: [],
      edges: [],
    };

    // Analyze import statements
    const imports = extractImportsFromCode(result.code);

    imports.forEach((imp) => {
      graph.nodes.push({
        id: imp.source,
        type: 'external',
        label: imp.source,
      });

      graph.edges.push({
        source: ctx.filename,
        target: imp.source,
        type: 'import',
      });
    });

    // Save dependency graph
    saveDependencyGraph(graph);

    // Add to result
    (result as any).dependencyGraph = graph;
  },
};
```

### 3. Code Transformation Plugin

```typescript
const codeTransformationPlugin = {
  transformImports: (result: GeneratorResult, ctx: ICompilationContext) => {
    // Convert Vue-specific imports to React equivalents
    const transformations = {
      vue: '@vureact/runtime-core',
      '@vue/composition-api': '@vureact/runtime-core',
      'vue-router': 'react-router-dom',
    };

    let code = result.code;

    Object.entries(transformations).forEach(([from, to]) => {
      const regex = new RegExp(`from ['"]${from}['"]`, 'g');
      code = code.replace(regex, `from '${to}'`);
    });

    result.code = code;
  },

  addPolyfills: (result: GeneratorResult, ctx: ICompilationContext) => {
    // Add polyfill imports for older browsers
    if (needsPolyfills(ctx.browserTarget)) {
      const polyfillImport = "import 'core-js/stable';\nimport 'regenerator-runtime/runtime';\n\n";
      result.code = polyfillImport + result.code;
    }
  },
};
```

## Plugin Development Best Practices

### 1. Error Handling

```typescript
const safePlugin = {
  myPlugin: (result: any, ctx: ICompilationContext) => {
    try {
      // Plugin logic
      performComplexOperation(result);
    } catch (error) {
      // Gracefully handle errors without affecting the compilation process
      console.warn(`Plugin myPlugin failed: ${error.message}`);

      // Add error information to the result
      if (!result.errors) result.errors = [];
      result.errors.push({
        plugin: 'myPlugin',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
};
```

### 2. Performance Optimization

```typescript
const optimizedPlugin = {
  efficientPlugin: (result: any, ctx: ICompilationContext) => {
    // Use cache to avoid redundant calculations
    if (!ctx.cache) ctx.cache = new Map();

    const cacheKey = `plugin-${ctx.filename}`;
    if (ctx.cache.has(cacheKey)) {
      return ctx.cache.get(cacheKey);
    }

    // Expensive computation
    const computedValue = expensiveComputation(result);

    ctx.cache.set(cacheKey, computedValue);
    return computedValue;
  },
};
```

### 3. Configurable Plugins

```typescript
// Create a configurable plugin factory
function createConfigurablePlugin(options = {}) {
  return {
    configurablePlugin: (result: any, ctx: ICompilationContext) => {
      const { enabled = true, logLevel = 'info', transformRules = {} } = options;

      if (!enabled) return;

      // Use configuration
      if (logLevel === 'debug') {
        console.debug('Plugin executing for:', ctx.filename);
      }

      // Apply transformation rules
      applyTransformRules(result, transformRules);
    },
  };
}

// Use the configurable plugin
export default defineConfig({
  plugins: {
    ...createConfigurablePlugin({
      enabled: process.env.NODE_ENV === 'development',
      logLevel: 'debug',
      transformRules: {
        vue: '@vureact/runtime-core',
      },
    }),
  },
});
```

## Plugin Execution Order

Plugins execute in the order they are configured:

1. Parse stage plugins (`parser`)
2. Transform stage plugins (`transformer`)
3. Codegen stage plugins (`codegen`)
4. Compilation completion plugins (plugins directly configured under `plugins`)

```javascript
export default defineConfig({
  plugins: {
    // These plugins execute after all stages
    pluginA: () => console.log('Executed last'),
    pluginB: () => console.log('Executed last'),

    parser: {
      // Parse stage plugins
      plugin1: () => console.log('Executed in first stage'),
      plugin2: () => console.log('Executed in first stage'),
    },

    transformer: {
      // Transform stage plugins
      plugin3: () => console.log('Executed in second stage'),
    },

    codegen: {
      // Codegen stage plugins
      plugin4: () => console.log('Executed in third stage'),
    },
  },
});
```

## Debugging Plugins

### 1. Using Logs

```typescript
const debugPlugin = {
  debugPlugin: (result: any, ctx: ICompilationContext) => {
    console.log('=== Plugin Debug Info ===');
    console.log('Filename:', ctx.filename);
    console.log('Stage:', ctx.currentStage);
    console.log('Result type:', result.constructor.name);
    console.log('Result keys:', Object.keys(result));
    console.log('========================');
  },
};
```

### 2. Development Tools

```typescript
// Plugin development helper
const pluginDevTools = {
  inspectResult: (result: any, ctx: ICompilationContext) => {
    if (process.env.VUREACT_PLUGIN_DEBUG) {
      // Save result to file for analysis
      const fs = require('fs');
      const path = require('path');

      const debugDir = path.join(ctx.root, '.vureact-debug');
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }

      const debugFile = path.join(
        debugDir,
        `${path.basename(ctx.filename)}-${ctx.currentStage}.json`,
      );

      fs.writeFileSync(debugFile, JSON.stringify(result, null, 2));

      console.log(`Debug info saved to: ${debugFile}`);
    }
  },
};
```

## Notes

1. **Do not modify original objects**: Try to create new objects or add new properties instead of modifying the internal state of the plugin system
2. **Keep plugins lightweight**: Plugins execute during the compilation of each file, so avoid expensive operations
3. **Handle asynchronous operations**: Plugins are currently synchronous; if asynchronous operations are needed, handle them inside the plugin
4. **Error boundaries**: Ensure plugin errors do not cause the entire compilation process to fail
5. **Compatibility**: Consider compatibility with different versions of VuReact and avoid using internal APIs
