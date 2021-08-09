export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/xdy-exploration-mode/templates"
  ];

  return loadTemplates(templatePaths);
}
