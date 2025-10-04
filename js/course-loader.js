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
            const sectionTitle = document.createElement("h3");
            sectionTitle.className = "section-title";
            sectionTitle.id = sectionId;
            sectionTitle.textContent = module.title;
            container.appendChild(sectionTitle);

            // Add to summary
            summaryHTML += `<button class="list-group-item list-group-item-action" data-target="#${sectionId}">${module.title}</button>`;

            module.lessons.forEach((lesson, lessonIndex) => {
                const itemId = `item-${moduleIndex}-${lessonIndex}`;
                const card = document.createElement("div");
                card.className = "accordion-item"; // keep the design style

                // Lesson title
                const header = document.createElement("h2");
                header.className = "accordion-header";
                header.textContent = lesson.title;
                card.appendChild(header);

                // Lesson body (always visible)
                const body = document.createElement("div");
                body.className = "accordion-body";

                const note = document.createElement("p");
                note.className = "lesson-note";
                note.textContent = lesson.note;

                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.className = "language-bash"; // you can adjust per course
                code.textContent = lesson.code;

                pre.appendChild(code);
                body.appendChild(note);
                body.appendChild(pre);
                card.appendChild(body);

                container.appendChild(card);
            });
        });

        summaryContainer.innerHTML = summaryHTML;

        // Summary click scroll behavior
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

        // Highlight summary on scroll
        window.addEventListener("scroll", () => {
            let currentIndex = 0;
            for (let i = 0; i < summaryItems.length; i++) {
                const targetSelector = summaryItems[i].getAttribute("data-target");
                const targetElement = document.querySelector(targetSelector);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 3) currentIndex = i;
                }
            }
            summaryItems.forEach((item, idx) => item.classList.toggle("active", idx === currentIndex));
        });

        Prism.highlightAll();

    } catch (error) {
        console.error("Failed to load course data:", error);
    }
}
