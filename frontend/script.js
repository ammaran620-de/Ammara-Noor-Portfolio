document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running ✅");

  /* =============================
    CONTACT CARD ANIMATION
  ============================== */
  const cards = document.querySelectorAll(".contact-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
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
        const targetWidth = bar.getAttribute("data-width");
        bar.style.width = targetWidth;
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* =============================
    NUMBER COUNTER ANIMATION
  ============================== */
  const counters = document.querySelectorAll(".progress-label");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const step = target / 50;

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
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    formStatus.textContent = "Sending...";
    formStatus.style.color = "#00c6ff"; // temporary color

    try {
     const res = await fetch("https://your-backend-url.vercel.app/contact", { { // <--- CHANGE THIS LINE
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        formStatus.textContent = data.message;
        formStatus.style.color = "#16a34a"; // Success color
        form.reset();
      } else {
        formStatus.textContent = data.error || "Something went wrong.";
        formStatus.style.color = "#ef4444"; // Error color
      }
    } catch (err) {
      console.error(err);
      formStatus.textContent = "Error connecting to server. Please try again later.";
      formStatus.style.color = "#ef4444";
    }
  });
}

  /* =============================
    BACK TO TOP BUTTON
  ============================== */
  const backToTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // show button after 300px
      backToTopBtn.style.opacity = 1;
      backToTopBtn.style.pointerEvents = "auto";
    } else {
      backToTopBtn.style.opacity = 0;
      backToTopBtn.style.pointerEvents = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});