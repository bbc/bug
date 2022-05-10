// taken from https://blog.irowell.io/blog/use-a-message-buffer-stack-to-handle-data/

class MessageBuffer {
    constructor(delimiter) {
        this.delimiter = delimiter;
        this.buffer = "";
    }

    isFinished() {
        return this.buffer.length === 0 || this.buffer.indexOf(this.delimiter) === -1;
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
        return this.getMessage();
    }
}

module.exports = MessageBuffer;
