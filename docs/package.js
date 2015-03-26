(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "hygiene\n=======\n\nKeeping clean\n",
      "mode": "100644",
      "type": "blob"
    },
    "hygiene.coffee.md": {
      "path": "hygiene.coffee.md",
      "content": "Hygiene\n=======\n\nHygiene keeps our biz clean.\n\nEventually it may expand to perform complex static analysis, but right now it's\njust a bunch of dumb regexes.\n\n    trailingWhitespace = /[ \\t]*$/gm\n    nothing = \"\"\n    newline = \"\\n\"\n\n    ensureTrailingNewline = (content) ->\n      if content.lastIndexOf(newline) != content.length - 1\n        \"#{content}#{newline}\"\n      else\n        content\n\n    module.exports =\n      clean: (content) ->\n        ensureTrailingNewline(\n          content\n          .replace(trailingWhitespace, nothing)\n        )\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.2.0\"\nentryPoint: \"hygiene\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/hygiene.coffee": {
      "path": "test/hygiene.coffee",
      "content": "Hygiene = require \"../hygiene\"\n\ndescribe \"cleaning\", ->\n  it \"should remove trailing whitespace\", ->\n    assert.equal Hygiene.clean(\"heyy   \\n\"), \"heyy\\n\"\n\n  it \"should ensure trailing newline\", ->\n    assert.equal Hygiene.clean(\"a\"), \"a\\n\"\n\n  it \"should keep empties empty\", ->\n    assert.equal Hygiene.clean(\"\"), \"\"\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "hygiene": {
      "path": "hygiene",
      "content": "(function() {\n  var ensureTrailingNewline, newline, nothing, trailingWhitespace;\n\n  trailingWhitespace = /[ \\t]*$/gm;\n\n  nothing = \"\";\n\n  newline = \"\\n\";\n\n  ensureTrailingNewline = function(content) {\n    if (content.lastIndexOf(newline) !== content.length - 1) {\n      return \"\" + content + newline;\n    } else {\n      return content;\n    }\n  };\n\n  module.exports = {\n    clean: function(content) {\n      return ensureTrailingNewline(content.replace(trailingWhitespace, nothing));\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"hygiene\"};",
      "type": "blob"
    },
    "test/hygiene": {
      "path": "test/hygiene",
      "content": "(function() {\n  var Hygiene;\n\n  Hygiene = require(\"../hygiene\");\n\n  describe(\"cleaning\", function() {\n    it(\"should remove trailing whitespace\", function() {\n      return assert.equal(Hygiene.clean(\"heyy   \\n\"), \"heyy\\n\");\n    });\n    it(\"should ensure trailing newline\", function() {\n      return assert.equal(Hygiene.clean(\"a\"), \"a\\n\");\n    });\n    return it(\"should keep empties empty\", function() {\n      return assert.equal(Hygiene.clean(\"\"), \"\");\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://hyperweb.space/?repo=distri/hygiene"
  },
  "version": "0.2.0",
  "entryPoint": "hygiene",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/hygiene",
    "homepage": null,
    "description": "Keeping clean",
    "html_url": "https://github.com/distri/hygiene",
    "url": "https://api.github.com/repos/distri/hygiene",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});