import WpRoles from 'server/lib/core/class_roles'

describe('WpRoles', () => {

  it('Renders a welcome message', () => {
    const welcome = WpRoles.initRolesFromDefault()
    expect(welcome).to.exist
    expect(welcome.text()).to.match(/Welcome!/)
  })

  it('Renders an awesome duck image', () => {
    const duck = WpRoles.initRolesFromDefault('img')
    expect(duck).to.exist
    expect(duck.attr('alt')).to.match(/This is a duck, because Redux!/)
  })

})
