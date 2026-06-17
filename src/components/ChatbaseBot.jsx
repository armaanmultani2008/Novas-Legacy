import { useEffect } from 'react';

function ChatbaseBot() {
    useEffect(() => {
        const SCRIPT_ID = "osjSmx285t5TcCgwvLhBn";

        if (document.getElementById(SCRIPT_ID)) return;

        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) {
                    window.chatbase.q = [];
                }
                window.chatbase.q.push(arguments);
            };

            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === "q") {
                        return target.q;
                    }
                    return (...args) => target(prop, ...args);
                }
            });
        }

        const onLoad = () => {
            const script = document.createElement("script");
            script.src = "https://www.chatbase.co/embed.min.js";
            script.id = SCRIPT_ID;
            script.domain = "www.chatbase.co";
            script.defer = true;
            document.body.appendChild(script);
        };

        if (document.readyState === "complete") {
            onLoad();
        } else {
            window.addEventListener("load", onLoad);
        }

        return () => {
            window.removeEventListener("load", onLoad);
            const scriptToRemove = document.getElementById(SCRIPT_ID);
            if (scriptToRemove) {
                document.body.removeChild(scriptToRemove);
            }
        };
    }, []);

    return null;
}

export default ChatbaseBot;