var XCLOUD_LIB = "libgamestreaming_native.so";

/*
 * Print all exports
 * Just run this once and save the output to pinpoint functions to hook
 * 
 */
/*
Process.enumerateModules()
    .filter(function(m) {
        return m["path"].toLowerCase().indexOf(XCLOUD_LIB) != -1;
    })
    .forEach(function(mod) {
        console.log(JSON.stringify(mod));
        mod.enumerateExports().forEach(function(exp) {
            console.log(exp.name);
        })
    });
*/

function basic_string_to_cstring(basic_string_ptr) {
	var size = basic_string_ptr.add(4).readUInt();
	var buf_ptr = basic_string_ptr.add(8).readPointer();

	return buf_ptr.readCString(size);
}

Interceptor.attach(Module.findExportByName(XCLOUD_LIB, "_ZN9Microsoft5Basix13base64_decodeERKNSt6__ndk112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEE"), {
	onEnter: function (args) {
        this.input_bs = args[1];

		console.log("-> base64_decode:: INPUT: " + basic_string_to_cstring(this.input_bs));
	},
	onLeave: function (retval) {
	}
});