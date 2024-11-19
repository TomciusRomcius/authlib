import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./authlib/main.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "authlib",
    version: Deno.args[0],
    description: 
      "A very basic JWT based auth library with sessions",
    license: "MIT",
    repository: {
      type: "github",
      url: "https://github.com/TomciusRomcius/authlib",
    },
    bugs: {
      url: "https://github.com/TomciusRomcius/authlib/issues"
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", "npm/README.md");
  },
})