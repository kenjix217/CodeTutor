/**
 * Parsons Problems UI
 * Drag and drop logic puzzle interface
 */

export class ParsonsUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.dragSrcEl = null;
    }

    render(problem) {
        // Scramble blocks
        const shuffled = [...problem.codeBlocks].sort(() => Math.random() - 0.5);
        
        const sourceHtml = shuffled.map((block, i) => `
            <div class="parsons-block" draggable="true" id="block-${i}" data-code="${block}">
                <pre>${block}</pre>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="parsons-container">
                <div class="parsons-column">
                    <h4>Available Blocks</h4>
                    <div class="parsons-area source-area" id="source-area">
                        ${sourceHtml}
                    </div>
                </div>
                <div class="parsons-column">
                    <h4>Your Solution</h4>
                    <div class="parsons-area target-area" id="target-area">
                        <div class="parsons-placeholder">Drag blocks here...</div>
                    </div>
                </div>
            </div>
            <button id="check-parsons" class="btn-primary" style="margin-top:1rem;">Check Solution</button>
            <div id="parsons-feedback"></div>
        `;
        
        this.setupDragDrop();
        
        document.getElementById('check-parsons').addEventListener('click', () => {
            this.checkSolution(problem.solution);
        });
    }

    setupDragDrop() {
        const blocks = this.container.querySelectorAll('.parsons-block');
        const areas = this.container.querySelectorAll('.parsons-area');

        blocks.forEach(block => {
            block.addEventListener('dragstart', this.handleDragStart.bind(this));
            block.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        areas.forEach(area => {
            area.addEventListener('dragover', this.handleDragOver.bind(this));
            area.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        this.dragSrcEl = e.target.closest('.parsons-block');
        e.target.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.dragSrcEl.innerHTML);
    }

    handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();
        
        const targetArea = e.target.closest('.parsons-area');
        if (targetArea && this.dragSrcEl) {
            // Remove placeholder if exists
            const placeholder = targetArea.querySelector('.parsons-placeholder');
            if (placeholder) placeholder.remove();
            
            targetArea.appendChild(this.dragSrcEl);
        }
        return false;
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
    }

    checkSolution(correctOrder) {
        const userBlocks = Array.from(document.getElementById('target-area').querySelectorAll('.parsons-block'));
        const userCode = userBlocks.map(el => el.getAttribute('data-code'));
        const feedback = document.getElementById('parsons-feedback');

        if (JSON.stringify(userCode) === JSON.stringify(correctOrder)) {
            feedback.innerHTML = '<span style="color:#10b981">✅ Correct! Great logic.</span>';
        } else {
            feedback.innerHTML = '<span style="color:#ef4444">❌ Not quite. Check the order.</span>';
        }
    }
}
