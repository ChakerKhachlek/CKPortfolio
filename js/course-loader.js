async function loadCourse(title, jsonUrl) {
    try {
        // Set course title
        const courseTitle = document.getElementById("course-title");
        if (courseTitle) courseTitle.textContent = title;

        // Fetch JSON data
        const res = await fetch(jsonUrl);
        const data = await res.json();

        const container = document.getElementById("course-content");
        const summaryContainer = document.getElementById("course-summary");

        let summaryHTML = "";

        data.modules.forEach((module, moduleIndex) => {
            const sectionId = `section-${moduleIndex}`;

            // Section title
            const sectionTitle = document.createElement("h3");
            sectionTitle.className = "section-title";
            sectionTitle.id = sectionId;
            sectionTitle.textContent = module.title;
            container.appendChild(sectionTitle);

            // Summary
            summaryHTML += `<button class="list-group-item list-group-item-action" data-target="#${sectionId}">${module.title}</button>`;

            module.lessons.forEach((lesson, lessonIndex) => {
                const card = document.createElement("div");
                card.className = "accordion-item";

                // Lesson title
                const header = document.createElement("h2");
                header.className = "accordion-header";
                header.textContent = lesson.title;
                card.appendChild(header);

                // Lesson content (always open)
                const body = document.createElement("div");
                body.className = "accordion-body";

                const note = document.createElement("p");
                note.className = "lesson-note";
                note.textContent = lesson.note;

                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.className = "language-bash"; 
                code.textContent = lesson.code;

                pre.appendChild(code);
                body.appendChild(note);
                body.appendChild(pre);
                card.appendChild(body);

                container.appendChild(card);
            });
        });

        summaryContainer.innerHTML = summaryHTML;

        // Summary click scroll
        const summaryItems = summaryContainer.querySelectorAll(".list-group-item");
        summaryItems.forEach((item) => {
            item.addEventListener("click", () => {
                const targetSelector = item.getAttribute("data-target");
                const targetElement = document.querySelector(targetSelector);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                    summaryItems.forEach((i) => i.classList.remove("active"));
                    item.classList.add("active");
                }
            });
        });

        // Scroll highlight
        window.addEventListener("scroll", () => {
            let currentIndex = 0;
            summaryItems.forEach((item, i) => {
                const target = document.querySelector(item.getAttribute("data-target"));
                if (target && target.getBoundingClientRect().top <= window.innerHeight / 3) currentIndex = i;
            });
            summaryItems.forEach((item, idx) => item.classList.toggle("active", idx === currentIndex));
        });

        Prism.highlightAll();

    } catch (error) {
        console.error("Failed to load course data:", error);
    }
}
