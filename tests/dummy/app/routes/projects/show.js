import Route from '@ember/routing/route';

export default class ProjectShowsRoute extends Route {
  model(params) {
    return { id: params.id };
  }
}
