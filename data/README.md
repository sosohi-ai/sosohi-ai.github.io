# Editing Website Content

The website reads its updateable content from the JSON files in this folder. You do not need to edit the page HTML for ordinary content updates.

## Where to edit

1. Open <https://github.com/sosohi-ai/sosohi-ai.github.io/tree/main/data>.
2. Select the relevant JSON file.
3. Click the pencil icon (`Edit this file`).
4. Add or revise an item while preserving the JSON structure.
5. Click `Commit changes` and commit to the `main` branch.

GitHub Pages will serve the updated data automatically after the commit is deployed.

## Files

- `news.json`: homepage news preview and the News page
- `projects.json`: homepage project preview and the Projects page
- `publications.json`: homepage featured publications and the Publications page
- `honors.json`: homepage Honors & Awards section

## Important JSON rules

- Use double quotes around text.
- Separate properties and items with commas.
- Do not add a comma after the last property or last item.
- Add new entries near the top of the relevant `items` array to keep reverse chronological order.
- Set `featured` to `true` for a publication or project that should also appear on the homepage.

When an edit is substantial or uncertain, update the data through Codex so the JSON and rendered pages can be validated before pushing.
