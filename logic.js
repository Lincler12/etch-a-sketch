
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

    function FillGrid() {
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

    function PixelResize() {
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
    const resetButton = document.getElementById('reset');
    const rgbRandomButton = document.getElementById('rgb-random');
    const eraserButton = document.getElementById('eraser');
    const blackButton = document.getElementById('black');
    const divItems = document.getElementsByClassName('item');

   
    class BrushState {
        static get DEFAULT() {
            return -1;
        }
        static get RGB() {
            return 1;
        }
        static get ERASER() {
            return 2;
        }
        static get BLACK() {
            return 3;
        }
    }
    let brushState = BrushState.DEFAULT;

    function PaintOnClickAndHover() {
        const divItemElements = document.getElementsByClassName('item');
        const rgbFunction = rgbRandomLogic();
        const eraserFunction = eraserLogic();

        window.addEventListener('mousedown', () => {
            mouseDownActive = true;
        });
        window.addEventListener('mouseup', () => {
            mouseDownActive = false;
        });

        function paintItems(e) {
            if (e.type === 'mousedown') { //the mousedown did not work correctly before adding this because mouseDownActive became true after the mousedown
                mouseDownActive = true;
            }
            switch (brushState) {
                case BrushState.RESET:
                case BrushState.RGB:
                    rgbFunction(e);
                    break;
                case BrushState.ERASER:
                    eraserFunction(e);
                    break;
                case BrushState.BLACK:
                default:
            }
           
            if (mouseDownActive && this.dataset.colored === 'false') {
                this.style.backgroundColor = brushColor;
                if(brushState !== BrushState.ERASER){
                    this.dataset.colored = 'true';
                }
            }


        };

        Array.from(divItemElements).forEach(item => {
            item.addEventListener('mouseover', paintItems);
            item.addEventListener('mousedown', paintItems);
        });



        function resetLogic() {
            Array.from(divItems).forEach(item => {
                item.style.backgroundColor = `white`;
                item.dataset.colored = 'false';
                item.dataset.bright = '100';
                item.style.filter = 'brightness(100%)';

            })
        }
        resetButton.addEventListener('click', resetLogic);

        
        
        function rgbRandomLogic(e) {
            const brightnessDropValue = 10;
            function RandomColor() {
                let red, green, blue;
                red = Math.floor(Math.random() * 256);
                green = Math.floor(Math.random() * 256);
                blue = Math.floor(Math.random() * 256);

                return `rgb(${red},${green},${blue})`;
            }

            return function parseItemsRGB(e) {

                if (e.target.dataset.colored === 'true' && mouseDownActive) {
                    if (!(e.target.dataset.bright === '0')) {
                        e.target.style.filter = `brightness(${parseInt(e.target.dataset.bright) - brightnessDropValue}%)`
                        e.target.dataset.bright = `${parseInt(e.target.dataset.bright) - brightnessDropValue}`;
                    }
                }
                brushColor = RandomColor();

            };
        }
      
        rgbRandomButton.addEventListener('click', () => {brushState = BrushState.RGB;});

        function eraserLogic(e) {

            return function parseItemsEraser(e) {
                if (mouseDownActive) {
                    e.target.style.filter = 'brightness(100%)';
                    brushColor= 'white';
                    e.target.dataset.colored = 'false';
                    e.target.dataset.bright = '100';
                }

            }
        }


        eraserButton.addEventListener('click', () => {
            brushState = BrushState.ERASER;
        });


    }
    PaintOnClickAndHover();


}


Logic();
