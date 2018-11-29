

describe('Very fast start to run the program', () => {
    it('insert some data into the dom', () => {
        // arrange
        document.body.innerHTML = '<div><span id="username">Test1</span><button id="button" /></div>'

        // assert
        const buttonEl = document.querySelector('#button');
        expect(buttonEl).not.toBe(null);
    })
})