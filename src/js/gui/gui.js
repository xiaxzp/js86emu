/**
 * Provides emulator gui module and classes
 *
 * @module GUI
 * @author Chad Rempp <crempp@gmail.com>
 */

define([
    "jquery",
    "underscore",
    "backbone",
    "gui/views/ControlView"],
function(
    $,
    _,
    backbone,
    ControlView)
{

    var GUI = {
        _debugToConsole : true,

        _memCenter : 0,

        _guiView : null,

        init : function ()
        {
            this._guiView = new ControlView();
            $("#gui-controls").append(this._guiView.render().el);

//            var el = document.getElementById('files')
//
//            if (el)
//            {
//                el.addEventListener('change', storage.handleSelectedDiskImg, false);
//            }
//            else
//            {
//                console.error("Missing page component 'files'");
//            }
        }

//        handleRun : function () {
//            cpu.run();
//            //$("").addClass('active');
//        },
//
//        handleReset : function () {
//            cpu.reset();
//            //$("").addClass('active');
//        },
//
//        handleHalt : function () {
//            cpu.halt();
//        },
//
//        handlePause : function () {
//            cpu.pause();
//        },
//
//        handleStep : function () {
//            cpu.step();
//        },
//
//        displayDecode : function (opcode_byte, addressing_byte, opcode) {
//            var decodedInst = oplist.retrieveCode(opcode_byte);
//            if (this._debugToConsole)
//            {
//                console.log("" +
//                    "--------------------------------------------------------------------[decode]\n" +
//                    "instruction : " + decodedInst + "\n" +
//                    "opcode_byte = 0x" + opcode_byte.toString(16) + " [" + opcode_byte.toString(2) + "]\n" +
//                    "    op : 0x" + opcode.opcode.toString(16) + " [" + opcode.opcode.toString(2) + "]\n" +
//                    "    d  : 0x" + opcode.d.toString(16) + " [" + opcode.d.toString(2) + "]\n" +
//                    "    w  : 0x" + opcode.w.toString(16) + " [" + opcode.w.toString(2) + "]\n" +
//                    "addressing_byte = 0x" + addressing_byte.toString(16) + " [" + addressing_byte.toString(2) + "]\n" +
//                    "    mod : 0x" + opcode.mod.toString(16) + " [" + opcode.mod.toString(2) + "]\n" +
//                    "    reg : 0x" + opcode.reg.toString(16) + " [" + opcode.reg.toString(2) + "]\n" +
//                    "    rm  : 0x" + opcode.rm.toString(16)  + " [" + opcode.rm.toString(2) + "]"
//                );
//
//            }
//
//            $("#debug-decode-instruction-val").text(decodedInst);
//            $("#debug-decode-opbyte-val").text(this._padHexByte(opcode_byte));
//            $("#debug-decode-opcode-val").text(this._padBinary(opcode.opcode, 6));
//            $("#debug-decode-d-val").text(this._padBinary(opcode.d, 1));
//            $("#debug-decode-w-val").text(this._padBinary(opcode.w, 1));
//            $("#debug-decode-addrbyte-val").text(this._padHexByte(addressing_byte));
//            $("#debug-decode-mod-val").text(this._padBinary(opcode.mod, 2));
//            $("#debug-decode-reg-val").text(this._padBinary(opcode.reg, 3));
//            $("#debug-decode-rm-val").text(this._padBinary(opcode.rm, 3));
//        },
//
//        displayRegisters : function (regObj)
//        {
//            if (this._debugToConsole)
//            {
//                console.log(
//                    "--------------------------------------------------------------------[registers]\n" +
//                        "  AX: " + this._padHexWord(regObj.AX) + "  BX: " + this._padHexWord(regObj.BX) + "  CX: " + this._padHexWord(regObj.CX) + "  DX: " + this._padHexWord(regObj.DX) + "\n" +
//                        "  SI: " + this._padHexWord(regObj.SI) + "  DI: " + this._padHexWord(regObj.DI) + "  BP: " + this._padHexWord(regObj.BP) + "  SP: " + this._padHexWord(regObj.SP) + "\n" +
//                        "  CS: " + this._padHexWord(regObj.CS) + "  DS: " + this._padHexWord(regObj.DS) + "  ES: " + this._padHexWord(regObj.ES) + "  SS: " + this._padHexWord(regObj.SS) + "\n" +
//                        "  IP: " + this._padHexWord(regObj.IP) + "  FLAGS : " + this._padHexWord(regObj.FLAGS) + " [" + this._padBinaryWord(regObj.FLAGS) + "]"
//                );
//            }
//
//            $('#debug-registers-AX-val').text(this._padHexWord(regObj.AX));
//            $('#debug-registers-BX-val').text(this._padHexWord(regObj.BX));
//            $('#debug-registers-CX-val').text(this._padHexWord(regObj.CX));
//            $('#debug-registers-DX-val').text(this._padHexWord(regObj.DX));
//            $('#debug-registers-SI-val').text(this._padHexWord(regObj.SI));
//            $('#debug-registers-DI-val').text(this._padHexWord(regObj.DI));
//            $('#debug-registers-BP-val').text(this._padHexWord(regObj.BP));
//            $('#debug-registers-SP-val').text(this._padHexWord(regObj.SP));
//            $('#debug-registers-CS-val').text(this._padHexWord(regObj.CS));
//            $('#debug-registers-DS-val').text(this._padHexWord(regObj.DS));
//            $('#debug-registers-ES-val').text(this._padHexWord(regObj.ES));
//            $('#debug-registers-SS-val').text(this._padHexWord(regObj.SS));
//            $('#debug-registers-IP-val').text(this._padHexWord(regObj.IP));
//            $('#debug-registers-FLAGHEX-val').text(this._padHexWord(regObj.FLAGS));
//            $('#debug-registers-FLAGBIN-val').text(this._padBinaryWord(regObj.FLAGS));
//        },
//
//        handleCenterMemoryButton : function ()
//        {
//            // Get address from input (should be in hex)
//            // TODO: validation
//            var addr = $('#debug-memory-center').val();
//
//            // Strip optional "0x" from string
//            addr = addr.replace("0x", "");
//            // Convert from hex to int
//            addr = parseInt(addr, 16);
//
//            this.centerMemoryDisplay(addr);
//            this.displayMemory();
//        },
//
//        handleVidTest : function ()
//        {
//            gfx.debugVideoTestPattern();
//            gfx.drawGraphics();
//        },
//
//        centerMemoryDisplay : function (center)
//        {
//            this._memCenter = center;
//        },
//
//        displayMemory : function ()
//        {
//            var $tbody = $('#debug-memory-table tbody');
//            var content = "";
//
//            // reset
//            $tbody.html('');
//
//            // Start (2 * 4) bytes before IP
//            var currAddr8 = this._memCenter - (2 * 4);
//
//            var currIP = cpu.getIP();
//
//            for (var i = 0; i < 5; i++)
//            {
//                var rangeStart = "--",
//                    rangeEnd = "--",
//                    v1 = "--",
//                    v2 = "--",
//                    v3 = "--",
//                    v4 = "--",
//                    v1Class = "", v2Class = "", v3Class = "", v4Class = "";
//
//                if (currAddr8 >= 0)
//                {
//                    v1 = this._padHexByte(cpu.getMem8(currAddr8));
//                    rangeStart = this._padHexWord(currAddr8)
//                }
//                if (currAddr8 + 1 >= 0)
//                    v2 = this._padHexByte(cpu.getMem8(currAddr8 + 1));
//
//                if (currAddr8 + 2 >= 0)
//                    v3 = this._padHexByte(cpu.getMem8(currAddr8 + 2));
//
//                if (currAddr8 + 3 >= 0)
//                {
//                    v4 = this._padHexByte(cpu.getMem8(currAddr8 + 3));
//                    rangeEnd = this._padHexWord(currAddr8 + 3);
//                }
//
//                if      (currIP === (currAddr8)) v1Class = "debug-memory-IP";
//                else if (currIP === (currAddr8 + 1)) v2Class = "debug-memory-IP";
//                else if (currIP === (currAddr8 + 2)) v3Class = "debug-memory-IP";
//                else if (currIP === (currAddr8 + 3)) v4Class = "debug-memory-IP";
//
//                content += "<tr class='debug-memory-row'>";
//                content += "    <td class='debug-memory-addr'>" + rangeStart + " - " + rangeEnd + "</td>";
//                content += "    <td class='debug-memory-value " + v1Class + "'>" + v1 + "</td>";
//                content += "    <td class='debug-memory-value " + v2Class + "'>" + v2 + "</td>";
//                content += "    <td class='debug-memory-value " + v3Class + "'>" + v3 + "</td>";
//                content += "    <td class='debug-memory-value " + v4Class + "'>" + v4 + "</td>";
//                content += "</tr>";
//
//                currAddr8 += 4;
//            }
//
//            $tbody.html(content);
//        },
//
//        _padBinary : function(val, num)
//        {
//            return String((new Array(num + 1).join("0")) + val.toString(2)).slice(-1 * num);
//        },
//        _padBinaryByte : function (val)
//        {
//            return String("00000000" + val.toString(2)).slice(-8);
//        },
//        _padBinaryWord : function (val)
//        {
//            return String("0000000000000000" + val.toString(2)).slice(-16);
//        },
//        _padHexByte : function (val)
//        {
//            return "0x" + String("00" + val.toString(16)).slice(-2);
//        },
//        _padHexWord : function (val)
//        {
//            return "0x" + String("0000" + val.toString(16)).slice(-4);
//        }
    };

    return GUI;
});


