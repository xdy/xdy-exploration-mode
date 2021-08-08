export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/xdy-party-group/templates"
  ];

  return loadTemplates(templatePaths);
}
