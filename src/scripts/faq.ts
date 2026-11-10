// FAQ accordion. Replaces the Webflow interaction (all ten questions shared one
// interaction id, so it only worked through Webflow's runtime). One item open at a time.
const items = Array.from(
  document.querySelectorAll<HTMLElement>(".home_faq-accordion"),
);

const answerOf = (item: HTMLElement) =>
  item.querySelector<HTMLElement>(".home_faq-answer")!;
const questionOf = (item: HTMLElement) =>
  item.querySelector<HTMLElement>(".home_faq-question")!;

function setOpen(item: HTMLElement, open: boolean) {
  const answer = answerOf(item);
  item.classList.toggle("is-open", open);
  questionOf(item).setAttribute("aria-expanded", String(open));
  if (open) {
    answer.style.height = `${answer.scrollHeight}px`;
    const done = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      answer.removeEventListener("transitionend", done);
      if (item.classList.contains("is-open")) answer.style.height = "auto";
    };
    answer.addEventListener("transitionend", done);
  } else {
    answer.style.height = `${answer.scrollHeight}px`;
    void answer.offsetHeight; // commit the explicit height before collapsing
    answer.style.height = "0px";
  }
}

items.forEach((item, i) => {
  const question = questionOf(item);
  const answer = answerOf(item);
  const id = `faq-answer-${i + 1}`;
  answer.id = id;
  answer.setAttribute("role", "region");
  question.setAttribute("role", "button");
  question.setAttribute("tabindex", "0");
  question.setAttribute("aria-controls", id);
  question.setAttribute("aria-expanded", "false");
  answer.style.height = "0px";

  const toggle = () => {
    const willOpen = !item.classList.contains("is-open");
    if (willOpen) {
      items.forEach((other) => {
        if (other !== item && other.classList.contains("is-open"))
          setOpen(other, false);
      });
    }
    setOpen(item, willOpen);
  };
  question.addEventListener("click", toggle);
  question.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});
