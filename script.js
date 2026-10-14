// Typing animation

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.isDeleting = false;
    this.tick();
};

TxtType.prototype.tick = function () {

    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};


window.addEventListener("load", function () {

    var elements = document.getElementsByClassName("typewrite");

    for (var i = 0; i < elements.length; i++) {

        var toRotate = elements[i].getAttribute("data-type");
        var period = elements[i].getAttribute("data-period");

        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }

    var css = document.createElement("style");

    css.innerHTML =
        ".typewrite > .wrap { border-right: 0.08em solid #fff; }";

    document.body.appendChild(css);

});


// Home title mouse movement

$(".anima-container").on("mousemove", function (e) {

    let screenX = e.originalEvent.screenX;
    const t = -(window.innerWidth / 2 - screenX);

    TweenMax.to(
        document.querySelectorAll(".anima-container .home_title span"),
        1,
        {
            x: function (e, o) {

                var i = 100 / (window.innerWidth / 2 / t);
                var a = (window.innerWidth - o.clientWidth) / 2 * (i / 100);

                return a;
            },

            force3D: true
        }
    );
});


// Video text animation

const videoSection = document.querySelector(".video");
const expandable = document.querySelector("#expandable");

function growTextOnScroll() {

    if (!videoSection || !expandable) {
        return;
    }

    const rect = videoSection.getBoundingClientRect();

    const progress = Math.max(
        0,
        Math.min(
            1,
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height)
        )
    );

    const scale = 0.25 + progress * 1.7;

    expandable.style.transform =
        `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("scroll", growTextOnScroll);
window.addEventListener("resize", growTextOnScroll);

growTextOnScroll();


// Image slider

const slide = document.querySelector(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

if (slide && next && prev) {

    next.onclick = function () {
        slide.appendChild(slide.firstElementChild);
    };

    prev.onclick = function () {
        slide.prepend(slide.lastElementChild);
    };
}


// Workout image change

const workoutItems = document.querySelectorAll(".workout-item");
const workoutImage = document.querySelector("#workoutImage");

if (workoutImage) {

    workoutItems.forEach(function (item) {

        item.addEventListener("mouseenter", function () {
            workoutImage.src = this.dataset.image;
        });

    });

}


function openArticle(image, title, date, text) {

    document.getElementById("articleImage").src = image;

    document.getElementById("articleTitle").textContent = title;

    document.getElementById("articleDate").textContent = date;

    document.getElementById("articleText").textContent = text;

}
