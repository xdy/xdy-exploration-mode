export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/xdy-module-template/templates"
  ];

  return loadTemplates(templatePaths);
}
