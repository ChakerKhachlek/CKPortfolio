async function loadCourse($courseLink) {
            try {
                const res = await fetch($courseLink);
                const data = await res.json();
                const container = document.getElementById("course-content");
                const summaryContainer = document.getElementById("course-summary");

                let summaryHTML = "";

                data.modules.forEach((module, moduleIndex) => {
                    const accordionId = `accordion-${moduleIndex}`;
                    const accordion = document.createElement("div");
                    accordion.className = "accordion mb-4";
                    accordion.id = accordionId;

                    const sectionId = `section-${moduleIndex}`;
                    const sectionTitle = document.createElement("h3");
                    sectionTitle.className = "section-title";
                    sectionTitle.id = sectionId;
                    sectionTitle.textContent = module.title;
                    container.appendChild(sectionTitle);

                    summaryHTML += `<button class="list-group-item list-group-item-action" data-target="#${sectionId}">${module.title}</button>`;

                    module.lessons.forEach((lesson, lessonIndex) => {
                        const itemId = `item-${moduleIndex}-${lessonIndex}`;
                        const accordionItem = document.createElement("div");
                        accordionItem.className = "accordion-item";

                        const header = document.createElement("h2");
                        header.className = "accordion-header";
                        header.id = `heading-${itemId}`;

                        const button = document.createElement("button");
                        button.className = "accordion-button"; // remove "collapsed" if present
                        button.type = "button";
                        button.setAttribute("data-bs-toggle", "collapse");
                        button.setAttribute("data-bs-target", `#collapse-${itemId}`);
                        button.setAttribute("aria-expanded", "true"); // set true to show
                        button.setAttribute("aria-controls", `collapse-${itemId}`);
                        button.textContent = lesson.title;

                        header.appendChild(button);
                        accordionItem.appendChild(header);

                        const collapseDiv = document.createElement("div");
                        collapseDiv.id = `collapse-${itemId}`;
                        collapseDiv.className = "accordion-collapse collapse show"; // add 'show' to make open
                        collapseDiv.setAttribute("aria-labelledby", `heading-${itemId}`);
                        collapseDiv.setAttribute("data-bs-parent", `#${accordionId}`);

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
                        collapseDiv.appendChild(body);
                        accordionItem.appendChild(collapseDiv);

                        accordion.appendChild(accordionItem);
                    });

                    container.appendChild(accordion);
                });

                summaryContainer.innerHTML = summaryHTML;

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