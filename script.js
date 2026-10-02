/* ============================================= */
/* Happy Birthday Nidhi - JavaScript             */
/* Enhanced with dynamic themes, birthday blast, */
/* infinite animations, ambient decor, final     */
/* memory message, and enhanced music controls.  */
/* ============================================= */

(function () {
    "use strict";

    /* ============================================= */
    /* PHOTO LIST — accepts png, jpg, webp, gif, etc. */
    /* Place image files in: assets/photos/            */
    /* ============================================= */
    var photos = [
        "assets/photos/photo1.png",
        "assets/photos/photo2.png",
        "assets/photos/photo3.png",
        "assets/photos/photo4.png",
        "assets/photos/photo5.png",
        // ── Add more photos below this line ──
        // "assets/photos/photo6.png",
        // "assets/photos/photo7.jpg",
    ];

    /* ============================================= */
    /* PERSONAL CAPTIONS (optional) — leave "" for none */
    /* ============================================= */
    var captions = [
        "Nidhi",  // Photo 1
        "Cool :)",  // Photo 2
        "RockStor",  // Photo 3
        "Dictatior",  // Photo 4
        "Hunter",  // Photo 5
    ];

    /* ============================================= */
    /* CONFIG                                         */
    /* ============================================= */
    var SLIDE_INTERVAL_MS   = 4000;
    var SLIDE_PRELOAD_AHEAD = 2;
    var CONFETTI_COUNT      = 40;
    var CONFETTI_COLORS = [
        "#ff8ad8", "#b39dff", "#7b68ee", "#ffc1e6",
        "#5ee5c9", "#ffa45b", "#ffd700", "#ff6b6b", "#4ecdc4",
    ];
    var PAGE_TRANSITION_MS = 950;
    var BLAST_DURATION_MS  = 2600;   // FEATURE 2: blast effect duration
    var INACTIVITY_MS      = 12000;  // ENHANCEMENT 2: 12-second inactivity to unlock surprise
    var HEART_EMOJIS = ["❤️", "💕", "💖", "💗", "💓", "💘"];
    var BALLOON_COLORS = [
        "linear-gradient(135deg, #ff8ad8, #ff5bbf)",
        "linear-gradient(135deg, #b39dff, #7b68ee)",
        "linear-gradient(135deg, #ffc1e6, #ff8ad8)",
        "linear-gradient(135deg, #a3ffe6, #5ee5c9)",
        "linear-gradient(135deg, #ffd3a3, #ffa45b)",
        "linear-gradient(135deg, #c2a3ff, #9d7bff)",
        "linear-gradient(135deg, #ffd700, #ffb347)",
        "linear-gradient(135deg, #ff9a56, #ff6a88)",
    ];

    /* ============================================= */
    /* FEATURE 1: DYNAMIC COLOR THEMES                */
    /* 8 premium themes — randomly applied on load.   */
    /* ============================================= */
    var THEMES = [
        "theme-purple", "theme-skyblue", "theme-rosegold",
        "theme-peach",  "theme-sunset",  "theme-lavender",
        "theme-mint",   "theme-golden",
    ];

    (function applyRandomTheme() {
        var t = THEMES[Math.floor(Math.random() * THEMES.length)];
        document.body.className = t;
    })();

    /* ============================================= */
    /* DOM REFERENCES                                 */
    /* ============================================= */
    var welcomePage   = document.getElementById("welcome-page");
    var galleryPage   = document.getElementById("gallery-page");
    var finalPage     = document.getElementById("final-page");
    var enterBtn      = document.getElementById("enter-btn");
    var slideshowEl   = document.getElementById("slideshow");
    var slideNavEl    = document.getElementById("slide-nav");
    var currentPhotoEl = document.getElementById("current-photo");
    var totalPhotoEl  = document.getElementById("total-photos");
    var audioEl       = document.getElementById("birthday-audio");
    var confettiWrap  = document.getElementById("confetti-container");
    var muteBtn       = document.getElementById("mute-btn");
    var captionEl     = document.getElementById("slide-caption");
    var loaderEl      = document.getElementById("slide-loader");
    var galleryCard   = document.querySelector("#gallery-page .gallery-card");
    var slidePrevBtn  = document.getElementById("slide-prev");
    var slideNextBtn  = document.getElementById("slide-next");
    var blastOverlay  = document.getElementById("blast-overlay");
    var balloonFloat  = document.getElementById("balloon-float");
    var ambientDecor  = document.getElementById("ambient-decor");
    var finalConfetti = document.getElementById("final-confetti");
    var finalHeartsEl = document.getElementById("final-hearts");

    /* ---- State ---- */
    var currentSlide    = 0;
    var slideTimer      = null;
    var isMuted         = false;
    var musicStarted    = false;
    var galleryRevealed = false;
    var finalShown      = false;
    var animLoopIds     = [];
    var hiddenSurpriseUnlocked = false;  // ENHANCEMENT 2: set true after 12s inactivity
    var inactivityTimer = null;          // ENHANCEMENT 2: 12s timer reference
    var finalPageTimer  = null;          // FIX: separate timer to navigate to final page after inactivity
    var collageEl       = document.getElementById("memory-collage"); // ENHANCEMENT 3: collage container

    /* ============================================= */
    /* FEATURE 3: INFINITE BALLOONS (Page 1)          */
    /* ============================================= */
    function spawnBalloon(container) {
        if (!container) return;
        var b = document.createElement("span");
        b.className = "balloon";
        b.style.left = Math.random() * 90 + 5 + "%";
        b.style.background = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        var dur = Math.random() * 5 + 10;
        b.style.animationDuration = dur + "s";
        var w = Math.random() * 25 + 50;
        b.style.width = w + "px";
        b.style.height = (w * 1.25) + "px";
        container.appendChild(b);
        setTimeout(function () {
            if (b.parentNode) b.parentNode.removeChild(b);
            if (container.parentNode) spawnBalloon(container);
        }, dur * 1000 + 200);
    }

    if (balloonFloat) {
        for (var bi = 0; bi < 6; bi++) {
            (function (idx) {
                setTimeout(function () { spawnBalloon(balloonFloat); }, idx * 600);
            })(bi);
        }
    }

    /* ============================================= */
    /* FEATURE 2: BIRTHDAY BLAST EFFECT               */
    /* Fire-and-forget: plays on top of the gallery    */
    /* without blocking navigation.                   */
    /* ============================================= */
    function playBirthdayBlast() {
        if (!blastOverlay) return;
        blastOverlay.classList.add("active");

        var n = 60;
        for (var i = 0; i < n; i++) {
            var p = document.createElement("span");
            p.className = "blast-confetti";
            p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            var a = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
            var d = Math.random() * 250 + 150;
            p.style.setProperty("--bx", Math.cos(a) * d + "px");
            p.style.setProperty("--by", Math.sin(a) * d + "px");
            p.style.animationDelay = (Math.random() * 0.3) + "s";
            if (Math.random() > 0.6) {
                p.style.borderRadius = "50%";
                p.style.width = "12px";
                p.style.height = "12px";
            }
            blastOverlay.appendChild(p);
            (function (el) {
                setTimeout(function () {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 2200);
            })(p);
        }

        for (var h = 0; h < 12; h++) {
            var heart = document.createElement("span");
            heart.className = "blast-heart";
            heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
            heart.style.fontSize = (Math.random() * 1 + 1.2) + "rem";
            var ha = (Math.PI * 2 * h) / 12 + (Math.random() - 0.5) * 0.3;
            var hd = Math.random() * 180 + 120;
            heart.style.setProperty("--hx", Math.cos(ha) * hd + "px");
            heart.style.setProperty("--hy", (Math.sin(ha) * hd - 80) + "px");
            heart.style.animationDelay = (Math.random() * 0.4) + "s";
            blastOverlay.appendChild(heart);
            (function (el) {
                setTimeout(function () {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 2500);
            })(heart);
        }

        /* Auto-hide overlay after blast duration (non-blocking) */
        setTimeout(function () {
            blastOverlay.classList.remove("active");
            while (blastOverlay.children.length > 4) {
                blastOverlay.removeChild(blastOverlay.lastChild);
            }
        }, BLAST_DURATION_MS);
    }

    /* ============================================= */
    /* PAGE TRANSITION: Welcome → Gallery (instant)   */
    /* FIX: No blocking delay. Gallery reveals        */
    /* immediately on click. Blast plays on top.      */
    /* ============================================= */
    enterBtn.addEventListener("click", function () {
        if (audioEl) {
            audioEl.volume = 0;
            audioEl.play()
                .then(function () {
                    musicStarted = true;
                    if (galleryRevealed) {
                        fadeVolume(audioEl, 0, 0.55, 2000);
                        updateMuteIcon();
                    }
                })
                .catch(function (err) {
                    console.warn("Audio play blocked, will retry.", err);
                    var retry = function () {
                        audioEl.play().then(function () {
                            fadeVolume(audioEl, 0, 0.55, 2000);
                            updateMuteIcon();
                        }).catch(function () {});
                        document.removeEventListener("click", retry);
                        document.removeEventListener("touchstart", retry);
                    };
                    document.addEventListener("click", retry);
                    document.addEventListener("touchstart", retry);
                });
        }

        /* FIX: Fire blast as non-blocking — plays on top of gallery */
        playBirthdayBlast();

        /* FIX: Immediately reveal gallery — no waiting for blast
           or CSS transitionend. Total delay < 200ms. */
        welcomePage.classList.remove("active");
        galleryPage.classList.add("active");
        galleryRevealed = true;

        /* FIX: Show the mute/speaker button now that we're on the
           gallery page (hidden on the welcome page). It stays
           visible on the final message page too. */
        if (muteBtn) muteBtn.classList.remove("hidden");

        /* Re-trigger fade-in animation on gallery card */
        if (galleryCard) {
            galleryCard.classList.remove("fade-in");
            void galleryCard.offsetWidth;
            galleryCard.classList.add("fade-in");
        }

        /* Start music fade-in immediately */
        if (musicStarted) {
            fadeVolume(audioEl, 0, 0.55, 2000);
            updateMuteIcon();
        } else {
            startMusic();
        }

        /* Start slideshow + all animations immediately */
        buildSlideshow();
        generateConfetti();
        generateSparkles();
        generateAmbientDecor();
        startInfiniteAnimations();
        startInactivityTimer();   /* ENHANCEMENT 2: begin 12s inactivity countdown */
    });

    /* ============================================= */
    /* BACKGROUND MUSIC                               */
    /* ============================================= */
    function startMusic() {
        if (!audioEl) return;
        audioEl.volume = 0;
        audioEl.play()
            .then(function () {
                fadeVolume(audioEl, 0, 0.55, 2000);
                updateMuteIcon();
            })
            .catch(function (err) {
                console.warn("Autoplay blocked, will retry.", err);
                var retry = function () {
                    audioEl.play().then(function () {
                        fadeVolume(audioEl, 0, 0.55, 2000);
                        updateMuteIcon();
                    }).catch(function () {});
                    document.removeEventListener("click", retry);
                    document.removeEventListener("touchstart", retry);
                };
                document.addEventListener("click", retry);
                document.addEventListener("touchstart", retry);
            });
    }

    if (muteBtn) {
        muteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            isMuted = !isMuted;
            audioEl.muted = isMuted;
            updateMuteIcon();
        });
    }

    function updateMuteIcon() {
        if (!muteBtn) return;
        muteBtn.textContent = isMuted ? "🔇" : "🔊";
        muteBtn.setAttribute("aria-label", isMuted ? "Unmute music" : "Mute music");
    }

    function fadeVolume(audio, from, to, duration) {
        var start = performance.now();
        function step(now) {
            var p = Math.min((now - start) / duration, 1);
            audio.volume = from + (to - from) * p;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ============================================= */
    /* SLIDESHOW                                      */
    /* ============================================= */
    function buildSlideshow() {
        if (slideshowEl.childElementCount > 0) return;
        var firstImg = null;

        photos.forEach(function (src, index) {
            var img = document.createElement("img");
            img.src = src;
            img.alt = "Nidhi birthday photo " + (index + 1);
            img.className = "slide" + (index === 0 ? " active" : "");
            img.width = 580;
            img.height = 435;

            if (index > SLIDE_PRELOAD_AHEAD) {
                img.loading = "lazy";
                img.removeAttribute("src");
                img.dataset.src = src;
            }

            img.addEventListener("error", function () {
                img.alt = "Photo " + (index + 1) + " coming soon";
                img.style.background = "linear-gradient(135deg, rgba(var(--accent-rgb),0.8), rgba(var(--accent-rgb),0.3))";
            });

            img.addEventListener("load", function () {
                if (index === 0) hideLoader();
            });

            slideshowEl.appendChild(img);
            if (index === 0) firstImg = img;

            var dot = document.createElement("span");
            dot.className = "dot" + (index === 0 ? " active" : "");
            dot.setAttribute("role", "button");
            dot.setAttribute("aria-label", "Go to photo " + (index + 1));
            dot.addEventListener("click", function () { goToSlide(index); });
            slideNavEl.appendChild(dot);
        });

        totalPhotoEl.textContent = photos.length;
        updateCaption(0);

        setTimeout(function () {
            if (firstImg && firstImg.complete) hideLoader();
        }, 1500);

        slideTimer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    }

    function hideLoader() {
        if (!loaderEl || loaderEl.style.display === "none") return;
        loaderEl.style.opacity = "0";
        setTimeout(function () {
            if (loaderEl) loaderEl.style.display = "none";
        }, 400);
    }

    function nextSlide() {
        /* FIX: Wrap around to photo 1 after the last photo instead of
           going to the final page. The final page is now triggered by
           the inactivity timer only (see startFinalPageTimer). */
        goToSlide((currentSlide + 1) % photos.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + photos.length) % photos.length);
    }

    if (slideNextBtn) {
        slideNextBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            nextSlide();
        });
    }
    if (slidePrevBtn) {
        slidePrevBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            prevSlide();
        });
    }

    function goToSlide(index) {
        var slides = slideshowEl.querySelectorAll(".slide");
        var dots   = slideNavEl.querySelectorAll(".dot");
        if (!slides.length) return;

        var target = slides[index];
        if (target && target.dataset.src) {
            target.src = target.dataset.src;
            target.removeAttribute("data-src");
            target.loading = "eager";
        }

        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");
        currentSlide = index;
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
        currentPhotoEl.textContent = currentSlide + 1;
        updateCaption(currentSlide);

        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    }

    function updateCaption(index) {
        if (!captionEl) return;
        var text = captions[index] || "";
        if (text) {
            captionEl.textContent = text;
            captionEl.style.opacity = "1";
        } else {
            captionEl.style.opacity = "0";
        }
    }

    /* ============================================= */
    /* FEATURE 8: FINAL MEMORY MESSAGE PAGE           */
    /* ============================================= */
    function showFinalPage() {
        if (finalShown) return;
        finalShown = true;

        galleryPage.classList.remove("active");
        finalPage.classList.add("active");

        var fc = finalPage.querySelector(".final-card");
        if (fc) {
            fc.classList.remove("fade-in");
            void fc.offsetWidth;
            fc.classList.add("fade-in");
        }

        if (finalConfetti) {
            for (var i = 0; i < 30; i++) {
                var p = document.createElement("span");
                p.className = "confetti";
                p.style.left = Math.random() * 100 + "%";
                p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
                p.style.animationDuration = (Math.random() * 3 + 3) + "s";
                p.style.animationDelay = (Math.random() * 4) + "s";
                p.style.opacity = Math.random() * 0.5 + 0.5;
                if (Math.random() > 0.7) {
                    p.style.borderRadius = "50%";
                    p.style.width = "12px";
                    p.style.height = "12px";
                }
                finalConfetti.appendChild(p);
            }
        }

        if (finalHeartsEl && !hiddenSurpriseUnlocked) {
            var hi = setInterval(function () {
                var h = document.createElement("span");
                h.className = "fh";
                h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
                h.style.left = Math.random() * 90 + 5 + "%";
                h.style.fontSize = (Math.random() * 0.8 + 1) + "rem";
                h.style.animationDuration = (Math.random() * 2 + 3) + "s";
                finalHeartsEl.appendChild(h);
                setTimeout(function () {
                    if (h.parentNode) h.parentNode.removeChild(h);
                }, 5500);
            }, 600);
            animLoopIds.push(hi);
        }

        /* ENHANCEMENT 3-5: If the hidden surprise was unlocked during
           the slideshow (12s inactivity), render the memory collage.
           Reuses existing slideshow photos — no duplicate image loading.
           Photos are shuffled and arranged in a polaroid-style layout
           with random rotation. Hearts continue floating around/behind. */
        if (hiddenSurpriseUnlocked && collageEl) {
            renderMemoryCollage();
        }
    }

    /* ============================================= */
    /* ENHANCEMENT 4: MEMORY COLLAGE RENDERER          */
    /* Creates polaroid-style cards using existing     */
    /* slideshow photos in random order with random     */
    /* rotation. Layout: 2-top, 1-center, 2-bottom.     */
    /* ============================================= */
    function renderMemoryCollage() {
        if (!collageEl) return;
        collageEl.innerHTML = "";  // clear any existing polaroids

        /* FIX: Re-create the hearts container inside the collage
           because innerHTML="" above wiped it. Hearts must float
           behind the polaroid cards. */
        var heartsDiv = document.createElement("div");
        heartsDiv.className = "final-hearts collage-hearts";
        heartsDiv.setAttribute("aria-hidden", "true");
        /* FIX: no inline height needed — CSS .collage-hearts uses
           position:absolute; height:100% to fill the collage area.
           The collage's own min-height / explicit height controls size. */
        collageEl.appendChild(heartsDiv);

        /* FIX: Start the hearts interval for this new container */
        var hi = setInterval(function () {
            var h = document.createElement("span");
            h.className = "fh";
            h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
            h.style.left = Math.random() * 90 + 5 + "%";
            h.style.fontSize = (Math.random() * 0.8 + 1) + "rem";
            h.style.animationDuration = (Math.random() * 2 + 3) + "s";
            heartsDiv.appendChild(h);
            setTimeout(function () {
                if (h.parentNode) h.parentNode.removeChild(h);
            }, 5500);
        }, 600);
        animLoopIds.push(hi);

        /* Also expand the collage height to fit the polaroid layout */
        collageEl.style.height = "280px";
        collageEl.style.minHeight = "260px";

        /* Shuffle photos array for a different arrangement each load */
        var shuffled = photos.slice().sort(function () { return Math.random() - 0.5; });

        /* Layout positions: 2-top, 1-center, 2-bottom.
           FIX: increased top values for the top-row photos (0→20, 5→25)
           so rotated polaroids with shadows/borders are not clipped by
           the collage container's overflow:hidden. Bottom spacing stays
           unchanged. */
        var positions = [
            { left: 5,  top: 20  },
            { left: 58, top: 25  },
            { left: 33, top: 50  },
            { left: 10, top: 95  },
            { left: 60, top: 100 },
        ];

        shuffled.forEach(function (src, i) {
            if (i >= positions.length) return;
            var pos = positions[i];
            var card = document.createElement("div");
            card.className = "polaroid";

            var rot = (Math.random() * 16 - 8);  /* -8deg to +8deg */
            card.style.transform = "rotate(" + rot + "deg)";
            card.style.left = pos.left + "%";
            card.style.top = pos.top + "px";
            card.style.animationDelay = (i * 0.15) + "s";

            var img = document.createElement("img");
            img.src = src;
            img.alt = "Memory photo " + (i + 1);
            img.loading = "lazy";
            card.appendChild(img);

            collageEl.appendChild(card);
        });

        /* Reveal the collage with fade-in */
        collageEl.classList.add("unlocked");
    }

    /* ============================================= */
    /* CONFETTI                                       */
    /* ============================================= */
    function generateConfetti() {
        if (!confettiWrap) return;
        for (var i = 0; i < CONFETTI_COUNT; i++) {
            createConfettiPiece(confettiWrap);
        }
    }

    function createConfettiPiece(container) {
        var p = document.createElement("span");
        p.className = "confetti";
        p.style.left = Math.random() * 100 + "%";
        p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        p.style.animationDuration = (Math.random() * 3 + 3) + "s";
        p.style.animationDelay = (Math.random() * 5) + "s";
        p.style.opacity = Math.random() * 0.5 + 0.5;
        if (Math.random() > 0.7) {
            p.style.borderRadius = "50%";
            p.style.width = "12px";
            p.style.height = "12px";
        }
        container.appendChild(p);
        var ms = (parseFloat(p.style.animationDelay) +
                  parseFloat(p.style.animationDuration)) * 1000 + 500;
        setTimeout(function () {
            if (p.parentNode) p.parentNode.removeChild(p);
        }, ms);
    }

    /* ============================================= */
    /* AMBIENT SPARKLES                               */
    /* ============================================= */
    function generateSparkles() {
        if (!confettiWrap) return;
        for (var i = 0; i < 18; i++) {
            createSparkle(confettiWrap);
        }
    }

    function createSparkle(container) {
        var d = document.createElement("span");
        d.className = "sparkle";
        d.style.left = Math.random() * 100 + "%";
        d.style.animationDuration = (Math.random() * 4 + 5) + "s";
        d.style.animationDelay = (Math.random() * 6) + "s";
        d.style.width = (Math.random() * 4 + 3) + "px";
        d.style.height = d.style.width;
        container.appendChild(d);
        var ms = (parseFloat(d.style.animationDelay) +
                  parseFloat(d.style.animationDuration)) * 1000 + 500;
        setTimeout(function () {
            if (d.parentNode) d.parentNode.removeChild(d);
        }, ms);
    }

    /* ============================================= */
    /* FEATURE 4: AMBIENT DECORATIONS BEHIND PHOTOS   */
    /* ============================================= */
    function generateAmbientDecor() {
        if (!ambientDecor) return;

        for (var g = 0; g < 6; g++) {
            var glow = document.createElement("span");
            glow.className = "amb-glow";
            var gw = Math.random() * 80 + 60;
            glow.style.width = gw + "px";
            glow.style.height = gw + "px";
            glow.style.left = Math.random() * 80 + 10 + "%";
            glow.style.top = Math.random() * 80 + 10 + "%";
            glow.style.background = "rgba(var(--accent-rgb), 0.4)";
            glow.style.animationDuration = (Math.random() * 6 + 8) + "s";
            glow.style.animationDelay = (Math.random() * 4) + "s";
            ambientDecor.appendChild(glow);
        }

        for (var s = 0; s < 20; s++) {
            var star = document.createElement("span");
            star.className = "amb-star";
            star.textContent = "\u2726";
            star.style.left = Math.random() * 95 + 2 + "%";
            star.style.top = Math.random() * 95 + 2 + "%";
            star.style.fontSize = (Math.random() * 0.5 + 0.6) + "rem";
            star.style.animationDuration = (Math.random() * 3 + 2) + "s";
            star.style.animationDelay = (Math.random() * 3) + "s";
            ambientDecor.appendChild(star);
        }
    }

    /* ============================================= */
    /* FEATURE 3: INFINITE ANIMATION LOOPS            */
    /* ============================================= */
    function startInfiniteAnimations() {

        var cl = setInterval(function () {
            if (confettiWrap) createConfettiPiece(confettiWrap);
        }, 1500);
        animLoopIds.push(cl);

        var sl = setInterval(function () {
            if (confettiWrap) createSparkle(confettiWrap);
        }, 2000);
        animLoopIds.push(sl);

        if (ambientDecor) {
            var hl = setInterval(function () {
                var h = document.createElement("span");
                h.className = "amb-heart";
                h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
                h.style.left = Math.random() * 90 + 5 + "%";
                h.style.fontSize = (Math.random() * 0.6 + 0.9) + "rem";
                h.style.animationDuration = (Math.random() * 4 + 6) + "s";
                ambientDecor.appendChild(h);
                setTimeout(function () {
                    if (h.parentNode) h.parentNode.removeChild(h);
                }, 11000);
            }, 2500);
            animLoopIds.push(hl);

            var asl = setInterval(function () {
                var sp = document.createElement("span");
                sp.className = "amb-sparkle";
                sp.style.left = Math.random() * 90 + 5 + "%";
                var sw = Math.random() * 4 + 3;
                sp.style.width = sw + "px";
                sp.style.height = sw + "px";
                sp.style.animationDuration = (Math.random() * 4 + 5) + "s";
                ambientDecor.appendChild(sp);
                setTimeout(function () {
                    if (sp.parentNode) sp.parentNode.removeChild(sp);
                }, 10000);
            }, 3000);
            animLoopIds.push(asl);
        }
    }

    /* ============================================= */
    /* ENHANCEMENT 2: HIDDEN SURPRISE INACTIVITY TIMER */
    /* Starts a 12s timer when the gallery opens.     */
    /* Any tap/click/swipe/arrow/dot resets it.       */
    /*                                               */
    /* FIX: Two things now happen after 12s inactive:  */
    /*   1. hiddenSurpriseUnlocked = true (silent)     */
    /*   2. Navigate to the final page (Page 3)        */
    /* Any user action (click/touch/swipe/arrow/dot)   */
    /* resets BOTH timers so the user can browse the    */
    /* slideshow freely. Only after 12s of NO action    */
    /* does it advance to the final message page.       */
    /* ============================================= */
    function startInactivityTimer() {
        resetInactivityTimer();
        /* Listen for ANY interaction on the gallery page to reset */
        galleryPage.addEventListener("click", resetInactivityTimer);
        galleryPage.addEventListener("touchstart", resetInactivityTimer);
        galleryPage.addEventListener("touchmove", resetInactivityTimer);
    }

    function resetInactivityTimer() {
        /* FIX: Clear both timers — the surprise unlock timer AND
           the final-page navigation timer. Both restart fresh
           on any user interaction. */
        clearTimeout(inactivityTimer);
        clearTimeout(finalPageTimer);

        /* Timer 1: Unlock the hidden surprise silently */
        inactivityTimer = setTimeout(function () {
            hiddenSurpriseUnlocked = true;
            console.log("Hidden surprise unlocked!");
        }, INACTIVITY_MS);

        /* FIX: Timer 2: Navigate to the final page after 12s
           of inactivity. This replaces the old behavior where
           the auto-slideshow advanced to the final page after
           the last photo. Now the user controls photo navigation,
           and the site only advances to Page 3 when they stop
           interacting for 12 seconds. */
        finalPageTimer = setTimeout(function () {
            if (!finalShown) {
                clearInterval(slideTimer);
                showFinalPage();
            }
        }, INACTIVITY_MS);
    }
})();
