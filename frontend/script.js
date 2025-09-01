document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running ✅"); // test message

  /* =============================
     CONTACT CARD ANIMATION
  ============================== */
  const cards = document.querySelectorAll(".contact-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log("Showing card:", entry.target); // debug
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));

  /* =============================
     SKILL BAR ANIMATION
  ============================== */
  const skillBars = document.querySelectorAll(".progress-bar span");
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute("data-width"); // read % from HTML
        bar.style.width = targetWidth; // animate to that width
        skillObserver.unobserve(bar); // animate only once
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* =============================
     OPTIONAL: NUMBER COUNTER
  ============================== */
  const counters = document.querySelectorAll(".progress-label");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const step = target / 50; // speed (50 steps)

        const updateCounter = () => {
          count += step;
          if (count < target) {
            counter.textContent = Math.floor(count) + "%";
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + "%";
          }
        };
        updateCounter();

        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* =============================
     CONTACT FORM SUBMIT (Frontend → Backend)
  ============================== */
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // stop page refresh

      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const message = document.querySelector("#message").value;

      try {
        const res = await fetch("http://localhost:5000/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        const data = await res.json();
        alert(data.msg); // show backend response ✅
      } catch (err) {
        console.error(err);
        alert("Something went wrong ❌");
      }
    });
  }
});
