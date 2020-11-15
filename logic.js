
function DisplayGridView() {
    const sizeOfGrid = 500;
    let ItemNumber = 15;
   
    function CreateGrid() {
        const newDivGridElement = document.createElement('div');
        newDivGridElement.setAttribute('class', 'grid');
        newDivGridElement.setAttribute('draggable', 'false');
        newDivGridElement.setAttribute('onmousedown', 'return false;');
        const gridViewElement = document.querySelector('div#grid-view');
        newDivGridElement.style.cssText = `width: ${sizeOfGrid}px; height: ${sizeOfGrid}px; grid-template-rows: repeat(${ItemNumber}, auto); grid-template-columns: repeat(${ItemNumber}, auto)`;
        gridViewElement.insertBefore(newDivGridElement, gridViewElement.lastElementChild);
        FillGrid();

       
    }

    function FillGrid(){
        let sizeOfPixel = sizeOfGrid / ItemNumber;
        const DivGridElement = document.querySelector('.grid');
        DivGridElement.style.cssText = `grid-template-rows: repeat(${ItemNumber}, auto); grid-template-columns: repeat(${ItemNumber}, auto)`;
        for (let i = 0; i < ItemNumber * ItemNumber; i++) {
            const newDivItemElement = document.createElement('div');
            newDivItemElement.setAttribute('class', 'item');
            newDivItemElement.setAttribute('data-colored', 'false');
            newDivItemElement.setAttribute('data-bright', '100');
            newDivItemElement.setAttribute('data-rgb', 'false');
            newDivItemElement.setAttribute('data-eraser', 'false');
            newDivItemElement.setAttribute('data-black', 'false');

            newDivItemElement.style.cssText = `width: ${sizeOfPixel}px; height: ${sizeOfPixel}px;`
            newDivItemElement.setAttribute('draggable', 'false');
            DivGridElement.appendChild(newDivItemElement);
        }
    }

    CreateGrid();
    function DisplayButtons() {
        const divOptionContainer = document.getElementById('option-container');
        const numberOfChildren = divOptionContainer.childElementCount;
        const optionContainerWidth = Math.floor(sizeOfGrid / numberOfChildren);
        Array.from(divOptionContainer.children).forEach(childNode => {
            childNode.style.cssText = `width: ${optionContainerWidth}px;`;
        })
    }
    DisplayButtons();

    function PixelResize(){
        ItemNumber = this.value;
        const previousGridPixels = document.querySelectorAll('.item');
        Array.from(previousGridPixels).forEach(previousGridPixel => {
            previousGridPixel.remove();
        })
        FillGrid();
        Logic();
    };
    document.getElementById('pixel-size').addEventListener('change', PixelResize);
}

DisplayGridView();

function Logic() {

  
    let brushColor = "black"
    let mouseDownActive = false;

    function PaintOnClickAndHover() {
        const divItemElements = document.getElementsByClassName('item');

        window.addEventListener('mousedown', () => {
            mouseDownActive = true;
        });
        window.addEventListener('mouseup', () => {
            mouseDownActive = false;
        });

        function paintItems(e) {
            if (e.type === 'mousedown') {
                mouseDownActive = true;
            }
            if (mouseDownActive && this.dataset.colored === 'false') {
                this.style.backgroundColor = brushColor;
                this.dataset.colored = 'true';
            }


        };

        Array.from(divItemElements).forEach(item => {
            item.addEventListener('mouseover', paintItems);
            item.addEventListener('mousedown', paintItems);
        });


    }

    PaintOnClickAndHover();

    function ButtonLogic() {
        const resetButton = document.getElementById('reset');
        const rgbRandomButton = document.getElementById('rgb-random');
        const eraserButton = document.getElementById('eraser');
        const blackButton = document.getElementById('black');
        const divItems = document.getElementsByClassName('item');

        let eventsObject = {
            resetButtonEvent: '',
            rgbRandomButtonEvent:'',
            eraserButtonEvent:'',
            blackButtonEvent:''
        }

        function resetLogic() {
            Array.from(divItems).forEach(item => {
                item.style.backgroundColor = `white`;
                item.dataset.colored = 'false';
                item.dataset.bright = '100';
                item.style.filter = 'brightness(100%)';

            })
        }
        resetButton.addEventListener('click', resetLogic);


        function rgbRandomLogic() {

        
            const brightnessDropValue = 10;
            function RandomColor() {
                let red, green, blue;
                red = Math.floor(Math.random() * 256);
                green = Math.floor(Math.random() * 256);
                blue = Math.floor(Math.random() * 256);

                return `rgb(${red},${green},${blue})`;
            }

            function parseItemsRGB() {

                if (this.dataset.colored === 'true' && mouseDownActive) {
                    if (!(this.dataset.bright === '0')) {
                        this.style.filter = `brightness(${parseInt(this.dataset.bright) - brightnessDropValue}%)`
                        this.dataset.bright = `${parseInt(this.dataset.bright) - brightnessDropValue}`;
                    }
                }
                brushColor = RandomColor();

                eventsObject.rgbRandomButtonEvent = parseItemsRGB;
            }

            Array.from(divItems).forEach(item => {
                item.addEventListener('mouseover', parseItemsRGB);
                item.addEventListener('mousedown', parseItemsRGB);
                item.dataset.rgb = 'true'
            })


        }
        function removeRGBEventListeners(item) {
            if (item.dataset.rgb === 'true') {
                item.removeEventListener('mouseover', eventsObject.rgbRandomButtonEvent);
                item.removeEventListener('mousedown', eventsObject.rgbRandomButtonEvent);
                item.dataset.rgb = 'false'
            }

        }
        rgbRandomButton.addEventListener('click', rgbRandomLogic);

        function eraserLogic() {

            
            function parseItemsEraser() {
                if (this.dataset.colored === 'true' && mouseDownActive) {
                    this.style.filter = 'brightness(100%)';
                    this.style.backgroundColor = 'white';
                    this.dataset.colored = 'false';
                    this.dataset.bright = '100';
                }

            }
            eventsObject.eraserButtonEvent = parseItemsEraser;
            Array.from(divItems).forEach(item => {
                item.addEventListener('mouseover', parseItemsEraser);
                item.addEventListener('mousedown', parseItemsEraser);
                item.dataset.eraser = 'true';
            })

        }

        function removeEraserEventListeners(item) {
            if (item.dataset.eraser === 'true') {
                item.removeEventListener('mouseover', eventsObject.eraserButtonEvent);
                item.removeEventListener('mousedown', eventsObject.eraserButtonEvent);
                item.dataset.eraser = 'false';
            }
        }

        eraserButton.addEventListener('click', eraserLogic);

        function removeListeners(e) {
            switch (e.target.id) {
                case "reset":
                    break;
                case "rgb-random":
                    Array.from(divItems).forEach(item => {
                        removeEraserEventListeners(item);

                    })
                    break;
                case "eraser":
                    Array.from(divItems).forEach(item => {
                        removeRGBEventListeners(item);
                    })
                    break;
                case "black":
                    break;
            }
        }
        window.addEventListener('click', removeListeners);


    }

    ButtonLogic();


}


Logic();
