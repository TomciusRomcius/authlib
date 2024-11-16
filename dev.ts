const authLibCmd = new Deno.Command("deno", {
  args: ["task", "dev:authlib"],
});

const testCmd = new Deno.Command("deno", {
  args: ["task", "dev:test"],
});

authLibCmd.spawn();
testCmd.spawn();

