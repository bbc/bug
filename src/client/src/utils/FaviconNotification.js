let options = {
    url: "/icon/favicon.ico",
    defaultColor: "#153550",
    criticalColor: "#B52425",
    errorColor: "#B52425",
    warningColor: "#D07110",
    infoColor: "#389FF4",
    lineColor: "#153550",
    title: "BUG",
};

let generatedIcon;
let iconElement;
let lastColor;
let count = {
    info: 0,
    warning: 0,
    critical: 0,
    error: 0,
};

export default class FaviconNotification {
    constructor(initOptions) {
        if (initOptions) {
            this.setOptions(initOptions);
        }
        this.addFavicon(options.url);
    }

    addTitle(count) {
        if (count > 0) {
            document.title = `(${count}) ${options.title}`;
        } else {
            document.title = options.title;
        }
    }

    addFavicon(src) {
        const head = document.getElementsByTagName("head")[0];
        iconElement = document.createElement("link");
        iconElement.type = "image/x-icon";
        iconElement.rel = "icon";
        iconElement.href = src;

        // remove existing favicons
        const links = document.getElementsByTagName("link");
        for (let i = 0, len = links.length; i < len; i++) {
            const exists = typeof links[i] !== "undefined";
            if (exists && (links[i].getAttribute("rel") || "").match(/\bicon\b/)) {
                head.removeChild(links[i]);
            }
        }

        head.appendChild(iconElement);
    }

    async generateIcon(color) {
        const img = document.createElement("img");
        img.src = options.url;

        const drawNotification = async (ctx, image) => {
            return new Promise((resolve) => {
                img.onload = async () => {
                    const lineWidth = 1;
                    const canvas = await document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const context = await canvas.getContext("2d");
                    await context.clearRect(0, 0, img.width, img.height);
                    await context.drawImage(img, 0, 0);

                    const centerX = img.width / 4.5 + lineWidth;
                    const centerY = img.height / 4.5 + lineWidth;
                    const radius = img.width / 4.5;

                    context.fillStyle = color;
                    context.strokeStyle = options.lineColor;
                    context.lineWidth = lineWidth;

                    await context.beginPath();
                    await context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
                    await context.closePath();
                    await context.fill();
                    await context.stroke();

                    const url = await context.canvas.toDataURL();
                    lastColor = color;
                    resolve(url);
                };
            });
        };

        return await drawNotification();
    }

    setOptions(newOptions) {
        for (let key in options) {
            options[key] = newOptions.hasOwnProperty(key) ? newOptions[key] : options[key];
        }
    }

    async add(color) {
        const totalCount = await this.getCount();
        await this.addTitle(totalCount);

        if (totalCount > 0) {
            if (color !== lastColor || !this.getColor) {
                generatedIcon = await this.generateIcon(color);
            }
            iconElement.href = generatedIcon;
        } else {
            this.clear();
        }
    }

    getColor() {
        let color = options["defaultColor"];
        for (let key in count) {
            if (count[key] > 0) {
                color = options[`${key}Color`];
            }
        }
        return color;
    }

    getCount() {
        let totalCount = 0;
        for (let key in count) {
            totalCount += count[key];
        }
        return totalCount;
    }

    async set(notificationCount) {
        count = notificationCount;
        const color = await this.getColor();
        this.add(color);
    }

    async critical() {
        count.critical += 1;
        const color = await this.getColor();
        this.add(color);
    }

    async warning() {
        count.warning += 1;
        const color = await this.getColor();
        this.add(color);
    }

    async info() {
        count.info += 1;
        const color = await this.getColor();
        this.add(color);
    }

    async error() {
        count.error += 1;
        const color = await this.getColor();
        this.add(color);
    }

    remove(type) {
        if (type) {
            count[type] -= 1;

            if (this.getCount > 0) {
                const color = this.getColor();
                this.add(color);
            } else {
                this.clear();
            }
        }
    }

    clear() {
        count = {
            critical: 0,
            info: 0,
            warning: 0,
            error: 0,
        };
        iconElement.href = options.url;
    }
}
