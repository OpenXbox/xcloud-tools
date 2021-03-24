# Xcloud tools

## Process names

### Windows 10

```
ContentTestApp.exe -> Windows 10 Content Test App / Gamestreaming Test App
```

### Android

```
com.microsoft.xboxone.smartglass -> Android Xbox App
com.microsoft.xboxone.smartglass.beta -> Android Xbox App (BETA)
com.gamepass -> Android Gamepass App
com.gamepass.beta -> Android Gamepass App (BETA)
```

## Windows 10 ETW providers

```
{3f3c85cb-a328-4467-96df-438d76b4ac59} Microsoft.Streaming.Nano.Network
{1ebc716b-a251-4114-b777-968f8557c215} Microsoft.Streaming.Nano.Network.Netsim
{e027bcec-71f3-4b85-ae28-90ff7446b675} Microsoft.Streaming.Nano.Network.urcp
{afc8a033-e28a-415c-acff-030e4b113a35} Microsoft.Streaming.Basix
{86750899-3dab-45e2-8f95-59dbefa0a7d6} Microsoft.Streaming.Nano.Input
{cb8b7862-eae7-4f30-9574-9453076ebaab} Microsoft.Streaming.Nano.Media
{d20f61e9-8929-4282-9b24-b07db5a27a76} Microsoft.Streaming.Nano
```

## Collecting data that helps in analysis

### Windows 10
#### Used tools

- Perfview (https://github.com/microsoft/perfview/releases)
- Python3 (https://www.python.org/downloads/)
- Frida (https://frida.re/)

#### Downloading ContentTestApp

- Go to (https://store.rg-adguard.net/)
- Choose `PackageFamilyName`, enter `Microsoft.XboxGameStreaming-ContentTest_8wekyb3d8bbwe`
- Scroll to the bottom, download file with suffix `*.appxbundle`
- Install App

#### Logging via perfview

- Download **PerfView64.exe** from: (https://github.com/microsoft/perfview/releases/tag/P2.0.66)
- In top-bar, click `Collect -> Collect`
- Check `Focus process` and enter **PID** of `ContentTestApp.exe`
- Set target `Data file`
- Hit `Advanced Options`
    - Uncheck everything
    - In `Additional providers` insert: `3f3c85cb-a328-4467-96df-438d76b4ac59::Verbose,1ebc716b-a251-4114-b777-968f8557c215::Verbose,e027bcec-71f3-4b85-ae28-90ff7446b675::Verbose,afc8a033-e28a-415c-acff-030e4b113a35::Verbose,86750899-3dab-45e2-8f95-59dbefa0a7d6::Verbose,cb8b7862-eae7-4f30-9574-9453076ebaab::Verbose,d20f61e9-8929-4282-9b24-b07db5a27a76::Verbose`

#### Frida

- Install Python3 x64 via windows installer (In setup, Check "Add PYTHON to PATH")
- In Cmd.exe/powershell.exe install frida: `pip install frida frida-tools`

#### Starting logging
- PerfView: Hit `Start Collecting`
- Wireshark: Start on desired interface
- Frida: Execute `frida -n ContentTestApp.exe -l frida/win10_xcloud_srtp_key.js`

## Dumping SRTP key

There are 2 options:

1. Use a SSL proxy and fetch the SRTP key from plaintext SSL traffic
2. Dump the key at runtime

### Dumping the key at runtime

1. Install frida / frida-tools (see #Frida section)
2. Find the correct frida-script in `frida/` subdirectory.
3. Run the process and let it startup to its "home"-screen
4. Execute frida scripts like this: `frida -n <PROCESS NAME> -l <SCRIPT NAME>.js` (For Android ADB connection you need to pass flag `-U`)

