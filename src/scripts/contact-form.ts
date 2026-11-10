// Replaces Webflow's form handler (which posts to webflow.com) with Web3Forms.
// Runs in the capture phase so Webflow's own submit handlers never see the event.
const ENDPOINT = "https://api.web3forms.com/submit";
const FAIL_TEXT =
  "Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам у Telegram.";

document.addEventListener(
  "submit",
  async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== "email-form") return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const block = form.closest(".w-form") as HTMLElement | null;
    const done = block?.querySelector<HTMLElement>(".w-form-done");
    const fail = block?.querySelector<HTMLElement>(".w-form-fail");
    const submit = form.querySelector<HTMLInputElement>('input[type="submit"]');
    const label = submit?.value ?? "";

    const data = new FormData(form);
    const source =
      form
        .closest(".home_contact-wrapper")
        ?.querySelector("h2")
        ?.textContent?.trim() ?? "Форма на сайті";
    const payload = {
      access_key: form.dataset.accessKey ?? "",
      subject: `Kontur: нова заявка (${source})`,
      from_name: "konturschool.com",
      "Ім'я": data.get("name"),
      "Телефон": data.get("Phone"),
      "Спосіб зв'язку": data.get("contact-way"),
      "Повідомлення": data.get("field-2"),
      "Форма": source,
    };

    if (submit) {
      submit.value = submit.dataset.wait ?? "Зачекайте...";
      submit.disabled = true;
    }
    if (fail) fail.style.display = "none";

    try {
      if (!payload.access_key) throw new Error("PUBLIC_WEB3FORMS_KEY is not set");
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? res.statusText);
      form.style.display = "none";
      if (done) done.style.display = "block";
    } catch (err) {
      console.error(err);
      if (fail) {
        const msg = fail.querySelector("div");
        if (msg) msg.textContent = FAIL_TEXT;
        fail.style.display = "block";
      }
    } finally {
      if (submit) {
        submit.value = label;
        submit.disabled = false;
      }
    }
  },
  true,
);
