import { createElement } from 'lwc';
import UnitTest from 'c/unitTest';
  
describe('c-unit-test', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
   
  it('displays unit status with default unitNumber', () => {
    const element = createElement('c-unit-test', {
      is: UnitTest
    });
    expect(element.unitNumber).toBe(5);
    // Add the element to the jsdom instance
    document.body.appendChild(element);
    // Verify displayed greeting
    const div = element.shadowRoot.querySelector('div');
    expect(div.textContent).toBe('Unit 5 alive!');
  });

  it('displays unit status with updated unitNumber', () => {
    const element = createElement('c-unit-test', {
     is: UnitTest
    });
    // Add the element to the jsdom instance
    document.body.appendChild(element);
    // Update unitNumber after element is appended
    element.unitNumber = 6
    const div = element.shadowRoot.querySelector('div');
    // Verify displayed unit status
    //expect(div.textContent).toBe('Unit 6 alive!');
    expect(div.textContent).not.toBe('Unit 6 alive!');
    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      expect(div.textContent).toBe('Unit 6 alive!');
    });    
  });

  it('displays unit status with input change event', () => {
    const element = createElement('c-unit-test', {
      is: UnitTest
    });
    document.body.appendChild(element);
    const div = element.shadowRoot.querySelector('div');
    // Trigger unit status input change
    const inputElement = element.shadowRoot.querySelector('lightning-input');
    inputElement.value = 7;
    inputElement.dispatchEvent(new CustomEvent('change'));
    return Promise.resolve().then(() => {
      expect(div.textContent).toBe('Unit 7 alive!');
    });
  });
});