using Microsoft.Diagnostics.Tracing;
using System;
using System.Text;
using System.IO;

class Program
{
    static FileStream fs = null;

    static int Main(string[] args)
    {
        if (args.Length != 2) {
            Console.WriteLine("Usage: EtlConverter.exe <input.etl> <output.log>");
            return 1;
        }

        var inputFile = args[0];
        var outputFile = args[1];

        if (!File.Exists(inputFile)) {
            Console.WriteLine("Input File {} does not exist", inputFile);
            return 2;
        }

        try {
            fs = new FileStream(outputFile, FileMode.Create);
        } catch (Exception e) {
            Console.WriteLine("Failed to open output file: {}", e);
            return 3;
        }

        using (var source = new ETWTraceEventSource(inputFile))
        {
            // setup the callbacks
            source.Dynamic.All += Print;

            // iterate over the file, calling the callbacks.
            Console.WriteLine("Processing...");
            source.Process();
            Console.WriteLine("Done!");
        }

        return 0;
    }

    static void Print(TraceEvent data)
    {
        if (data.ProviderName.StartsWith("Microsoft.Streaming"))
        {
            var line = Encoding.UTF8.GetBytes(data.TimeStamp.ToString("hh.mm.ss.ffffff") + " " + data.ToString() + "\n");
            fs.Write(line, 0, line.Length);
        }
    }
}
