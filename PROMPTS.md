# PROMPTS Log

This file logs prompts/messages sent to AI tools during development for this repository.

## Tool: OpenAI Codex (Chat)

### Prompt 01
The Challenge
The task is to build out a front-end accomplishing the following using React and Typescript

Display a list of images. Make a GET request to /pets to retrieve a JSON array of JSON objects that represent pet objects. These JSON objects will include properties like an image URL, title, description, entity creation date. You need to present these images and associated data in a compelling and interactive way. Use fetch for fetching data.
Allow the user to select several images and download them. Display a count of currently selected items and an estimated total file size for the selection.
Ability to: Select All, Clear Selection
Ability to: Sort by Name A-Z, Sort by Name Z-A, Sort by Date (Newest First), Sort by Date (Oldest First)
Searchbar to filter displayed images by title or description
Use of styled-components for the UI
Use of react-router-dom - implement a detail view for each pet (e.g. /pets/:id) using dynamic routing, an About Me page, and any other pages you think would be relevant
Create a Custom Hook for Loading and Managing Data. The hook must handle loading, error, and empty states explicitly.
Manage Global and Local State Effectively (can use context, redux, hooks, etc). Selection state must persist when navigating between routes (e.g. navigating to a detail view and back should not lose selections).
Implement pagination or infinite scroll for the image gallery
Responsive design: 1 column on mobile, 2 columns on tablet, 4 columns on desktop
Document code where necessary
In addition to the requirements above, feel free to get creative! Build upon this project in any way you feel best demonstrates your strengths as a front-end developer.

### Prompt 02
before running npm install, run nvm use 22, to get higher version

### Prompt 03
im getting
Unable to load pets
Unexpected token '<', "<!doctype "... is not valid JSON

Try again

why

### Prompt 04
for /pets use
[{"title":"Tim \u0026 Jim","description":"The best buds that anyone could have","url":"https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Barky Spears","description":"Woof! I did it again","url":"https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Pickles","description":"Judging you for dropping the ball","url":"https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Woody","description":"Lost the laser pointer a while ago but still trying to play along","url":"https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Mathis","description":"Beautiful, but not easily fooled by your ploys to distract her from her upcoming meal.","url":"https://images.pexels.com/photos/290204/pexels-photo-290204.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Bucky","description":"Here to remind you that not all heros wear caps...some are just Dachshunds","url":"https://images.pexels.com/photos/895259/pexels-photo-895259.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Montana","description":"Got her eyes on that prize...peanut butter","url":"https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Smol","description":"His name is Smol because he is just that...smol","url":"https://images.pexels.com/photos/53966/rabbit-palm-hand-snatch-53966.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Frito","description":"Bathtime isn\u0027t his favprote but he\u0027s tolerant.","url":"https://images.pexels.com/photos/485294/pexels-photo-485294.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Benny","description":"Strong genetic predispositon for mailmen suspicion.","url":"https://images.pexels.com/photos/1619690/pexels-photo-1619690.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Len","description":"Strengths: sitting on command for treats. Weaknesses: Fear of thunder.","url":"https://images.pexels.com/photos/2664417/pexels-photo-2664417.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Sasha","description":"She\u0027s beauty... she\u0027s grace... she might attack your face...","url":"https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Dottie","description":"Just always having too good a time...you can take her anywhere...wags her tail with unparalleled force.","url":"https://images.pexels.com/photos/1591939/pexels-photo-1591939.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Moose","description":"Loves: walks down the street and belly rubs. Hates: whenever the door bell rings.","url":"https://images.pexels.com/photos/1390784/pexels-photo-1390784.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Duchess","description":"Tolerates being held. Consistently gets the zooms between 2 to 3 am.","url":"https://images.pexels.com/photos/1383397/pexels-photo-1383397.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Hagrid","description":"Don\u0027t let his size intimidate you. The sweetest bug around.","url":"https://images.pexels.com/photos/1521304/pexels-photo-1521304.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Midnight","description":"Talented at Hide \u0026 Seek. Excellent hunter.","url":"https://images.pexels.com/photos/37337/cat-silhouette-cats-silhouette-cat-s-eyes.jpg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Marten","description":"Senior Bun. Loves Cilantro.","url":"https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Sandy","description":"Often found on warm rocks.","url":"https://images.pexels.com/photos/407037/gecko-reptile-terrarium-lizard-407037.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Rupert","description":"Endurance athlete with occasional sprints to the retrieve the daily feed.","url":"https://images.pexels.com/photos/886210/pexels-photo-886210.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"},{"title":"Polly","description":"Excellent imitator. Dislikes being patronized with crackers.","url":"https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?format\u003dtiny","created":"Sat May 23 22:51:35 UTC 2026"}]

### Prompt 05
push the code

### Prompt 06
Add a Download Manager + ZIP export
-Turn “Download Selected” into queued downloads with progress, retry, cancel, and “Download as ZIP”.

### Prompt 07
i want this download manager to be like google downlod manager, with download icon-button at top right corner. Also whne clicked the button or when it opens it should also be like google, a small model should open

### Prompt 08
Add this download manager feature to a new branch and commit it

### Prompt 09
add a new feature in a new branch
Accessibility pass (WCAG-minded)
Full keyboard flow, visible focus states, aria-live for status messages, better labels, skip link.

### Prompt 10
no dont commit now, you can do it later

### Prompt 11
i want this feature to be pushed, but its hould not be merged into main. In readme mention this extra feature and also where it is and why it doesnt merged because its an extra from what asked

### Prompt 12
in main does this have tests and if not
add this
Testing depth
RTL unit tests for hook/context logic + Playwright E2E for search/sort/select/download flow.

### Prompt 13
push the changes

## Notes

- This log captures the development prompts exchanged with the primary AI coding assistant used for this repository work.
- Branch-level implementation prompts and follow-up instructions are included in chronological order.
