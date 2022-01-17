function specparent(a, b) { //returns parent element with specific tag, a is child and b is parent's tag
    for (b = b.toLowerCase(); a && a.parentNode;)
        if (a = a.parentNode, a.tagName && a.tagName.toLowerCase() == b) return a;
    return null
}
document.addEventListener('contextmenu', (e) => { //event for right click
    const varray = Array.from(document.querySelectorAll("div[data-testid='videoPlayer']")).filter(i => i.contains(e.target)); //this is array of targets
    if (varray.length > 0) { //checks if rclick was over video player 
        const css = ` 
            .fxtwitterclass {
                background-color: unset;
            }
            body[style*="background-color: rgb(21, 32, 43)"] .fxtwitterclass:hover,
            body[style*="background-color: #15202B"] .fxtwitterclass:hover {
                background-color: rgba(255, 255, 255, 0.03);
            }
            body[style*="background-color: rgb(255, 255, 255)"] .fxtwitterclass:hover,
            body[style*="background-color: #FFFFFF"] .fxtwitterclass:hover {
                background-color: rgba(0, 0, 0, 0.03);
            }
        `; //stylesheet for the new rclick items
        const style = document.createElement('style'); //creates style el
        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style); //appends to head
        const menu = varray[0];
        const url = Array.from(specparent(menu, "article").querySelectorAll("a")).filter(a => a.href.includes("status"))[0].href; //url is pulled from a A tag inside the tweet (article)

        function change() { //function for simplicity
            const ogitem = menu.querySelector("div[role='menuitem']"); //original item <> Copy Video Adress
            const flex = ogitem.parentElement; //container/parent
            if (!flex.contains(flex.querySelector(".fxtwitterclass"))) { //checks if fxtwitter items are already there
                const opt1 = ogitem.cloneNode(true); //clones a copy of ogitem
                opt1.querySelector("span").textContent = "Copy Twitfix Link"; //item text
                opt1.classList.add("fxtwitterclass"); //class
                opt1.addEventListener("click", () => navigator.clipboard.writeText(url.replace("https://", "https://fx"))); //adds click event and using navigator api, copies the url to clipboard);
                const opt2 = ogitem.cloneNode(true); //same as above
                opt2.querySelector("span").textContent = "Copy MP4 Link";
                opt2.classList.add("fxtwitterclass");
                opt2.addEventListener("click", () => navigator.clipboard.writeText(url.replace("https://", "https://fx").concat(".mp4")));
                flex.append(opt1); //appends to container/parent
                flex.append(opt2);
            }
        }
        //Interval that checks every 4ms after rclick, waits until twitter's context menu appears then applies change and finally stops
        /*Todo: Find a better way to handle this, current imp. can cause potential bugs:
            For example two rclicks can be triggered same time causing wrong items being added to twitter context
        */
        var step = 0; //added so it stops after a while
        let inter = setInterval(() => {
            step += 1;
            if (menu.querySelector("div[role='menuitem']") != null) { //checks if twitter's context menu exists
                change();
                clearInterval(inter);
                step = 0;
            } else if (step > 10000) {
                clearInterval(inter);
                step = 0;
            }
        }, 4);
    }
});