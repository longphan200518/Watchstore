using System.Diagnostics;

Console.WriteLine("🚀 Starting Admin Frontend...");
Console.WriteLine("");

// Check if Node.js is installed
try
{
  var nodeCheck = Process.Start(new ProcessStartInfo
  {
    FileName = "node",
    Arguments = "--version",
    RedirectStandardOutput = true,
    UseShellExecute = false,
    CreateNoWindow = true
  });
  nodeCheck?.WaitForExit();

  if (nodeCheck?.ExitCode != 0)
  {
    Console.WriteLine("❌ ERROR: Node.js is not installed!");
    Console.WriteLine("📥 Please install Node.js from: https://nodejs.org/");
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
    return;
  }
}
catch
{
  Console.WriteLine("❌ ERROR: Node.js is not installed or not in PATH!");
  Console.WriteLine("📥 Please install Node.js from: https://nodejs.org/");
  Console.WriteLine("⚙️  After installing, restart Visual Studio");
  Console.WriteLine("\nPress any key to exit...");
  Console.ReadKey();
  return;
}

Console.WriteLine("✅ Node.js detected");
Console.WriteLine("📂 Installing packages (this may take a few minutes)...");
Console.WriteLine("");

var frontendPath = Path.Combine(Directory.GetCurrentDirectory(), "..");

var npmInstall = Process.Start(new ProcessStartInfo
{
  FileName = "cmd.exe",
  Arguments = "/c npm install",
  WorkingDirectory = frontendPath,
  UseShellExecute = false,
  RedirectStandardOutput = true,
  RedirectStandardError = true
});

if (npmInstall != null)
{
  npmInstall.OutputDataReceived += (sender, e) => { if (!string.IsNullOrEmpty(e.Data)) Console.WriteLine(e.Data); };
  npmInstall.ErrorDataReceived += (sender, e) => { if (!string.IsNullOrEmpty(e.Data)) Console.WriteLine(e.Data); };
  npmInstall.BeginOutputReadLine();
  npmInstall.BeginErrorReadLine();
  npmInstall.WaitForExit();
}

Console.WriteLine("");
Console.WriteLine("✅ Packages installed!");
Console.WriteLine("🌐 Starting dev server on http://localhost:3001");
Console.WriteLine("⏳ Opening browser...");
Console.WriteLine("");

var npmDev = new ProcessStartInfo
{
  FileName = "cmd.exe",
  Arguments = "/c start cmd /k \"npm run dev\"",
  WorkingDirectory = frontendPath,
  UseShellExecute = true
};

Process.Start(npmDev);

Thread.Sleep(3000); // Wait 3 seconds

try
{
  Process.Start(new ProcessStartInfo
  {
    FileName = "http://localhost:3001",
    UseShellExecute = true
  });
}
catch { }

Console.WriteLine("✅ Admin app is starting!");
Console.WriteLine("📱 URL: http://localhost:3001");
Console.WriteLine("");
Console.WriteLine("Press any key to stop...");
Console.ReadKey();