/*
 * XCloud session masterkey dumping on windows 10
 */

var XCLOUD_WIN10 = "gamestreaming_sdk.dll";

function basic_string_to_cstring(basic_string_ptr) {
    var size = basic_string_ptr.add(16).readUInt();
    var buf_ptr = basic_string_ptr.readPointer();

    return buf_ptr.readCString(size);
}

var BaseAddr = Module.findBaseAddress(XCLOUD_WIN10);
while (BaseAddr == null) {
    console.log('.');
    BaseAddr = Module.findBaseAddress(XCLOUD_WIN10);
}

var m = Process.getModuleByName(XCLOUD_WIN10);
console.log("BASE:  " + m.base);

// The pattern that you are interested in:
const pattern = '48 89 5c 24 18 48 89 7c 24 20 55 41 54 41 55 41 56 41 57 48 8d 6c 24 c9 48 81 ec e0 00 00 00 48';
var results = Memory.scanSync(m.base, m.size, pattern);

if (results.length != 1)
{
    console.log("Func pattern not found or multiple occurences... Found pattern " + results.length + " times");
} else {
    var base64_decode_func = results[0].address

    console.log('Hooking base64_decode @ ' + base64_decode_func);
    Interceptor.attach(ptr(base64_decode_func), {
        onEnter: function (args) {
            console.log("-> base64_decode(" + args[0] + ", " + args[1] + ")");
            console.log("SRTP key: " + basic_string_to_cstring(args[1]));
        },
        onLeave: function (retval) {
        }
    });
}