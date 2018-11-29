import Navigation from './navigation';

describe('Navigation', () => {
  it('.draw should wrap template with tag section.navitation', () => {
    // prepare - Arrange 

    // action  - Act
    Navigation.draw();

    // check - Assert
    expect(document.querySelector('body>section.navigation')).not.toBe('');
  });
});
