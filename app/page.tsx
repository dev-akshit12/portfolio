"use client";

import Image from "next/image";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

const TYPING_WORDS = [
  "full stack web apps.",
  "secure Django platforms.",
  "interactive Next.js interfaces.",
  "modern product experiences.",
] as const;

const WORK_ITEMS = [
  {
    title: "Encrypted Chat System",
    date: "Personal Build",
    href: "https://chatsystem.sbs/",
    image: "/images/Encrypted Chat System.png",
    description:
      "I built this encrypted chat system using Django and Next.js to work on secure communication, full stack architecture, and a clean user experience.",
  },
  {
    title: "Online Multiplayer Drawing Game",
    date: "Personal Build",
    href: "https://onlinedrawinggame.online/",
    image: "/images/Online Multiplayer Drawing Game.png",
    description:
      "This is a browser-based multiplayer drawing game inspired by Skribbl, where players can join, draw, guess, and play together in real time.",
  },
  {
    title: "CrackTheLab",
    date: "Professional Contribution",
    description:
      "CrackTheLab is one of the products I have worked on in my current role at Craw Cyber Security, where I have contributed to development and ongoing improvements on a live platform.",
  },
  {
    title: "DLP Data Loss Protection",
    date: "Professional Contribution",
    description:
      "I also contributed to a Data Loss Protection project, supporting selected development tasks and practical improvements as part of the team workflow.",
  },
  {
    title: "ShieldXDR",
    date: "Professional Contribution",
    description:
      "For ShieldXDR, I supported parts of the development work and helped with product-side improvements while working with the broader team.",
  },
] as const;

const SKILL_GROUPS = [
  {
    title: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "Rust"],
  },
  {
    title: "Frameworks",
    skills: ["Django", "Next.js", "REST API Integration"],
  },
  {
    title: "Databases & Tools",
    skills: ["MySQL", "PostgreSQL", "Git"],
  },
  {
    title: "Cloud & Security",
    skills: ["AWS", "Azure", "Cybersecurity Basics"],
  },
] as const;

const RESUME_PREVIEW_SRC = "/resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1";
const RESUME_MODAL_SRC = "/resume.pdf#navpanes=0";
const CONTACT_FORM_ENDPOINT = "https://formsubmit.co/ajax/akshitkohli90@gmail.com";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/dev-akshit12",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.59 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.05 1.53 1.05.9 1.55 2.35 1.1 2.92.84.09-.66.35-1.1.63-1.35-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.74 0 0 .84-.27 2.75 1.05A9.35 9.35 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.64.71 1.03 1.62 1.03 2.74 0 3.93-2.33 4.79-4.56 5.05.36.32.68.93.68 1.88 0 1.36-.01 2.45-.01 2.78 0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.26C22 6.59 17.52 2 12 2Z"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akshit-kohli-83b342250/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.94 8.5A1.56 1.56 0 1 0 6.9 5.38a1.56 1.56 0 0 0 .04 3.12ZM5.6 9.78h2.63V18H5.6V9.78Zm4.28 0h2.52v1.12h.04c.35-.67 1.21-1.37 2.49-1.37 2.67 0 3.17 1.8 3.17 4.13V18h-2.63v-3.86c0-.92-.02-2.11-1.25-2.11-1.25 0-1.44.99-1.44 2.04V18H9.88V9.78Z"
        />
      </svg>
    ),
  },
] as const;

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isContactSending, setIsContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".scroll-reveal, .scroll-reveal-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const activeWord = TYPING_WORDS[wordIndex];
  const maxTypedChars = useMemo(
    () => Math.max(...TYPING_WORDS.map((word) => word.length)),
    [],
  );
  const typedWord = useMemo(
    () => activeWord.slice(0, letterCount),
    [activeWord, letterCount],
  );

  useEffect(() => {
    let timeoutDelay = isDeleting ? 42 : 78;

    if (!isDeleting && letterCount === activeWord.length) {
      timeoutDelay = 1100;
    }

    if (isDeleting && letterCount === 0) {
      timeoutDelay = 220;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting && letterCount === activeWord.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && letterCount === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        return;
      }

      setLetterCount((prev) => prev + (isDeleting ? -1 : 1));
    }, timeoutDelay);

    return () => window.clearTimeout(timeoutId);
  }, [activeWord, isDeleting, letterCount]);

  useEffect(() => {
    if (!isResumeOpen && !isContactOpen && !isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isMenuOpen) {
          setIsMenuOpen(false);
          return;
        }

        if (isContactOpen) {
          setIsContactOpen(false);
          return;
        }

        setIsResumeOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContactOpen, isMenuOpen, isResumeOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsContactSending(true);
    setContactStatus("idle");

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false || payload?.success === "false") {
        throw new Error("Unable to send");
      }

      form.reset();
      setContactStatus("success");
    } catch {
      setContactStatus("error");
    } finally {
      setIsContactSending(false);
    }
  };

  return (
    <main className="simple-home-shell">
      <header className="simple-header">
        <nav className="simple-nav">
          <a className="simple-brand" href="#home">
            Akshit
          </a>

          <button
            type="button"
            className={`simple-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <div
            id="mobile-nav-drawer"
            className={`simple-nav-drawer ${isMenuOpen ? "is-open" : ""}`}
          >
            <div className="simple-nav-links">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  className="simple-nav-link"
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="simple-socials">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  className="simple-social-link"
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section className="simple-hero" id="home">
        <div className="simple-copy">
          <p className="simple-intro">Hello, I&apos;m Akshit,</p>
          <h1 className="simple-title">
            Python Full Stack
            <br />
            Developer
          </h1>
          <p className="simple-typing" aria-live="polite">
            <span className="simple-typing-prefix">I build</span>
            <span
              className="simple-typing-slot"
              style={{ width: `${maxTypedChars}ch`, maxWidth: "100%" }}
            >
              <span className="simple-typing-word">{typedWord}</span>
              <span className="simple-typing-cursor" aria-hidden="true">
                |
              </span>
            </span>
          </p>

          <a className="simple-resume-btn simple-resume-btn-desktop" href="/resume.pdf" download>
            Resume
          </a>
        </div>

        <div className="simple-portrait-wrap">
          <div className="simple-portrait-ring" />
          <div className="simple-portrait">
            <Image
              src="/images/portfolio_pic.jpg"
              alt="Akshit portrait"
              width={700}
              height={700}
              priority
            />
          </div>
          <div className="simple-plus simple-plus-top">
            <span />
            <span />
            <span />
          </div>
          <div className="simple-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <a className="simple-resume-btn simple-resume-btn-mobile" href="/resume.pdf" download>
          Resume
        </a>
      </section>

      <section className="simple-content-section scroll-reveal" id="about">
        <div className="simple-content-block">
          <h2 className="simple-section-mark">about.</h2>
          <p className="simple-section-lead">
            I am a Python Full Stack Developer focused on building clean and practical web applications.
            I mainly work with Django and Next.js, and I also have working knowledge of AWS and Azure.
            I like building projects that are simple to use, easy to maintain, and useful in real-world work.
          </p>

          <div className="simple-timeline">
            <article className="simple-timeline-item scroll-reveal-item" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
              <div className="simple-timeline-dot" />
              <div>
                <h3>2019</h3>
                <p>
                  Completed 10th and started moving toward the path I wanted to build for myself.
                </p>
              </div>
            </article>

            <article className="simple-timeline-item scroll-reveal-item" style={{ "--reveal-delay": "90ms" } as CSSProperties}>
              <div className="simple-timeline-dot" />
              <div>
                <h3>2021</h3>
                <p>
                  Completed 12th in the arts stream, then decided to move fully toward technology and web
                  development.
                </p>
              </div>
            </article>

            <article className="simple-timeline-item scroll-reveal-item" style={{ "--reveal-delay": "180ms" } as CSSProperties}>
              <div className="simple-timeline-dot" />
              <div>
                <h3>2021 - 2024</h3>
                <p>
                  Completed BCA and spent those years improving my skills in programming, web development,
                  databases, and project-based learning.
                </p>
              </div>
            </article>

            <article className="simple-timeline-item scroll-reveal-item" style={{ "--reveal-delay": "270ms" } as CSSProperties}>
              <div className="simple-timeline-dot" />
              <div>
                <h3>2025 - Present</h3>
                <p>
                  Currently working at Craw Cyber Security as a full-time Python Developer. I contribute to web
                  applications and security-focused products, and I also work as a Python Trainer, teaching core
                  Python, OOP, data structures, and full stack development in a practical way.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="simple-content-section scroll-reveal" id="work">
        <div className="simple-content-block">
          <h2 className="simple-section-mark">work.</h2>
          <p className="simple-section-lead">
            This section includes both personal projects and professional work. The personal projects are things
            I built myself, and the rest are products I have contributed to during my current role.
          </p>

          <div className="simple-work-grid">
            {WORK_ITEMS.map((item, index) => (
              <article
                key={item.title}
                className="simple-work-card scroll-reveal-item"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                {"image" in item ? (
                  <a
                    className="simple-work-image simple-work-image-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={1200}
                      height={800}
                    />
                    <span className="simple-work-overlay">
                      <span className="simple-work-overlay-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M14 5h5v5h-1.8V8.07l-6.96 6.97-1.28-1.28 6.97-6.96H14V5ZM6 7h5v2H8v7h7v-3h2v5H6V7Z"
                          />
                        </svg>
                      </span>
                      <span className="simple-work-overlay-text">Visit Project</span>
                    </span>
                  </a>
                ) : null}
                <p className="simple-work-date">{item.date}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-content-section scroll-reveal" id="skills">
        <div className="simple-content-block">
          <h2 className="simple-section-mark">skills.</h2>
          <p className="simple-section-lead">
            Technical skills I use across full stack development, backend logic, frontend interfaces, cloud
            awareness, and practical project delivery.
          </p>

          <div className="simple-skills-grid">
            {SKILL_GROUPS.map((group, index) => (
              <article
                key={group.title}
                className="simple-skill-card scroll-reveal-item"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <h3>{group.title}</h3>
                <div className="simple-skill-list">
                  {group.skills.map((skill) => (
                    <span key={skill} className="simple-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-content-section scroll-reveal" id="contact">
        <div className="simple-content-block">
          <div className="simple-contact-panel scroll-reveal-item" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
            <h2 className="simple-section-mark">contact.</h2>

            <div className="simple-contact-layout">
              <button
                type="button"
                className="simple-resume-preview"
                onClick={() => setIsResumeOpen(true)}
                aria-label="Open resume preview"
              >
                <span className="simple-resume-preview-frame" aria-hidden="true">
                  <iframe
                    className="simple-resume-embed"
                    src={RESUME_PREVIEW_SRC}
                    title="Resume preview"
                    loading="lazy"
                    tabIndex={-1}
                  />
                </span>
                <span className="simple-resume-preview-badge" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7 13L13 7M9 7H13V11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <div className="simple-contact-copy simple-contact-copy-wide">
                <p>
                  If you want a clean website, a portfolio redesign, or a full stack project with modern frontend
                  quality, feel free to connect with me. I am open to internships, freelance work, and creative
                  collaborations.
                </p>

                <button
                  type="button"
                  className="simple-contact-open-btn"
                  onClick={() => {
                    setContactStatus("idle");
                    setIsContactOpen(true);
                  }}
                >
                  Contact Me
                </button>

                <div className="simple-contact-links">
                  <a href="tel:+919213945077">+91 9213945077</a>
                  <a href="mailto:akshitkohli90@gmail.com">akshitkohli90@gmail.com</a>
                  <a href="https://github.com/dev-akshit12" target="_blank" rel="noreferrer">
                    github.com/dev-akshit12
                  </a>
                  <a
                    href="https://www.linkedin.com/in/akshit-kohli-83b342250/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/akshit-kohli-83b342250
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isResumeOpen ? (
        <div
          className="simple-resume-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          onClick={() => setIsResumeOpen(false)}
        >
          <div className="simple-resume-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="simple-resume-modal-header">
              <h3 id="resume-modal-title">Resume</h3>
              <button
                type="button"
                className="simple-resume-modal-close"
                onClick={() => setIsResumeOpen(false)}
                aria-label="Close resume preview"
              >
                Close
              </button>
            </div>

            <iframe className="simple-resume-modal-frame" src={RESUME_MODAL_SRC} title="Akshit resume" />
          </div>
        </div>
      ) : null}

      {isContactOpen ? (
        <div
          className="simple-resume-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          onClick={() => setIsContactOpen(false)}
        >
          <div className="simple-contact-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="simple-resume-modal-header">
              <h3 id="contact-modal-title">Send a message</h3>
              <button
                type="button"
                className="simple-resume-modal-close"
                onClick={() => setIsContactOpen(false)}
                aria-label="Close contact form"
              >
                Close
              </button>
            </div>

            <form
              className="simple-contact-form"
              action={CONTACT_FORM_ENDPOINT}
              method="POST"
              onSubmit={handleContactSubmit}
            >
              <input type="hidden" name="_subject" value="New portfolio contact message" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input
                className="simple-contact-honeypot"
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="simple-contact-form-grid">
                <label className="simple-contact-field">
                  <span>Name</span>
                  <input type="text" name="name" placeholder="Your name" required autoComplete="name" />
                </label>

                <label className="simple-contact-field">
                  <span>Phone</span>
                  <input type="tel" name="phone" placeholder="Your number" autoComplete="tel" />
                </label>

                <label className="simple-contact-field">
                  <span>Email</span>
                  <input type="email" name="email" placeholder="Your email" required autoComplete="email" />
                </label>

                <label className="simple-contact-field simple-contact-field-full">
                  <span>Message</span>
                  <textarea name="message" placeholder="Write your message here" rows={6} required />
                </label>
              </div>

              <div className="simple-contact-form-footer">
                <p
                  className={`simple-contact-form-status ${
                    contactStatus === "success"
                      ? "is-success"
                      : contactStatus === "error"
                        ? "is-error"
                        : ""
                  }`}
                >
                  {contactStatus === "success"
                    ? "Message sent successfully."
                    : contactStatus === "error"
                      ? "Message could not be sent. Please try again."
                      : "Your message will be sent directly to my email."}
                </p>

                <button type="submit" className="simple-contact-submit-btn" disabled={isContactSending}>
                  {isContactSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={`simple-scroll-top ${showScrollTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 14V6M10 6L6.75 9.25M10 6l3.25 3.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </main>
  );
}
