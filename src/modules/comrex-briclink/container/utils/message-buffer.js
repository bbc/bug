// const hexdump = (buffer, blockSize) => {
//     blockSize = blockSize || 32;
//     var lines = [];
//     var hex = "0123456789ABCDEF";
//     for (var b = 0; b < buffer.length; b += blockSize) {
//         var block = buffer.slice(b, Math.min(b + blockSize, buffer.length));
//         var addr = ("0000" + b.toString(16)).slice(-4);
//         var codes = block
//             .split("")
//             .map(function (ch) {
//                 var code = ch.charCodeAt(0);
//                 return " " + hex[(0xf0 & code) >> 4] + hex[0x0f & code];
//             })
//             .join("");
//         codes += "   ".repeat(blockSize - block.length);
//         var chars = block.replace(/[\x00-\x1F\x20]/g, ".");
//         chars += " ".repeat(blockSize - block.length);
//         lines.push(addr + " " + codes + "  " + chars);
//     }
//     return lines.join("\n");
// };

// taken from https://blog.irowell.io/blog/use-a-message-buffer-stack-to-handle-data/

class MessageBuffer {
    constructor(delimiter) {
        this.delimiter = delimiter;
        this.buffer = "";
    }

    isFinished() {
        if (this.buffer.length === 0 || this.buffer.indexOf(this.delimiter) === -1) {
            return true;
        }
        return false;
    }

    push(data) {
        this.buffer += data;
    }

    getMessage() {
        const delimiterIndex = this.buffer.indexOf(this.delimiter);
        if (delimiterIndex !== -1) {
            const message = this.buffer.slice(0, delimiterIndex);
            this.buffer = this.buffer.replace(message + this.delimiter, "");
            return message;
        }
        return null;
    }

    handleData() {
        /**
         * Try to accumulate the buffer with messages
         *
         * If the server isnt sending delimiters for some reason
         * then nothing will ever come back for these requests
         */
        const message = this.getMessage();
        return message;
    }
}

module.exports = MessageBuffer;
