document.addEventListener('DOMContentLoaded', () => {
    // 1. For Loop that types itself out
    const startForLoopButton = document.getElementById('startForLoop');
    const forLoopCodeElement = document.getElementById('forLoopCode');
    const forLoopExplanation = document.getElementById('forLoopExplanation');
    const forLoopExample = `
for (let i = 0; i < 5; i++) {
    console.log("Iteration: " + i);
}
`;
    let charIndex = 0;
    let typingInterval;

    function typeForLoopCode() {
        if (charIndex < forLoopExample.length) {
            forLoopCodeElement.textContent += forLoopExample.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            forLoopExplanation.innerHTML = `
                <p><strong>Explanation:</strong> This <code>for</code> loop iterates 5 times. It initializes <code>i</code> to 0, continues as long as <code>i</code> is less than 5, and increments <code>i</code> by 1 in each iteration. You can see how it automatically "typed" itself out, demonstrating how a loop can perform repetitive tasks.</p>
            `;
            forLoopExplanation.style.display = 'block';
        }
    }

    startForLoopButton.addEventListener('click', () => {
        forLoopCodeElement.textContent = ''; // Clear previous text
        forLoopExplanation.style.display = 'none';
        charIndex = 0;
        clearInterval(typingInterval); // Clear any existing interval
        typingInterval = setInterval(typeForLoopCode, 50); // Type character by character
    });


    // 2. Click event that explains addEventListener
    const myButton = document.getElementById('myButton');
    const clickEventExplanation = document.getElementById('clickEventExplanation');
    const clickEventCode = document.getElementById('clickEventCode');

    const clickCodeExample = `
document.getElementById('myButton').addEventListener('click', function() {
    // This function runs when the button is clicked
    alert('You clicked the button!');
    console.log('Button was clicked!');
});
`;
    clickEventCode.textContent = clickCodeExample;

    myButton.addEventListener('click', () => {
        clickEventExplanation.innerHTML = `
            <p><strong>Explanation:</strong> You just triggered a <code>click</code> event! The <code>addEventListener()</code> method was used to "listen" for this specific event on the "Click Me!" button. When the event (a click) occurred, the anonymous function provided to <code>addEventListener</code> was executed, displaying this explanation. This is fundamental for making web pages interactive.</p>
        `;
        clickEventExplanation.style.display = 'block';
    });


    // 3. setTimeout that waits before explaining what it just did
    const startTimeoutButton = document.getElementById('startTimeout');
    const timeoutMessage = document.getElementById('timeoutMessage');
    const setTimeoutCode = document.getElementById('setTimeoutCode');

    const timeoutCodeExample = `
setTimeout(() => {
    // This code will run after 3000 milliseconds (3 seconds)
    console.log('Timeout finished!');
    // An explanation would appear here in the live example
}, 3000);
`;
    setTimeoutCode.textContent = timeoutCodeExample;

    startTimeoutButton.addEventListener('click', () => {
        timeoutMessage.textContent = 'Waiting for 3 seconds...';
        timeoutMessage.style.display = 'block';

        setTimeout(() => {
            timeoutMessage.innerHTML = `
                <p><strong>Explanation:</strong> This message appeared after a 3-second delay, thanks to <code>setTimeout()</code>! This function is incredibly useful for executing code after a specified period, like showing a notification, animating elements, or delaying an action until other processes complete.</p>
            `;
        }, 3000); // 3000 milliseconds = 3 seconds
    });


    // 4. DOM manipulation reveals structure
    const manipulateDomButton = document.getElementById('manipulateDom');
    const domInsight = document.getElementById('domInsight');
    const domManipulationCode = document.getElementById('domManipulationCode');

    const domCodeExample = `
// Get a reference to the 'domInsight' element
const insightElement = document.getElementById('domInsight');

// Change its content
insightElement.innerHTML = \`
    <h3>DOM Insight Revealed!</h3>
    <p>JavaScript just <strong>modified this paragraph directly!</strong></p>
    <p>It used <code>document.getElementById('domInsight')</code> to find this specific part of the page, and then changed its <code>innerHTML</code> property. This is how JS "sees" and interacts with the HTML structure, allowing for dynamic content updates.</p>
\`;

// Add a new class for styling
insightElement.classList.add('dom-revealed');
`;
    domManipulationCode.textContent = domCodeExample;


    manipulateDomButton.addEventListener('click', () => {
        domInsight.innerHTML = `
            <h3>DOM Insight Revealed!</h3>
            <p>JavaScript just <strong>modified this paragraph directly!</strong></p>
            <p>It used <code>document.getElementById('domInsight')</code> to find this specific part of the page, and then changed its <code>innerHTML</code> property. This is how JS "sees" and interacts with the HTML structure, allowing for dynamic content updates.</p>
        `;
        domInsight.classList.add('dom-revealed'); // Add a class for potential styling changes
    });
});
