// ASYNCHRONOUS PROGRAMMING PARADIGM
// Handles non-blocking data fetching from the JSON file.
// Uses async/await for cleaner syntax and better error handling.
async function loadPortfolioData(){
    try{
        const response = await fetch('cv.json');
        const data = await response.json();
        return data;
    } catch (error){
        console.error(" * Error loading CV data:", error);
        return null;
    }
}

// OBJECT-ORIENTED PROGRAMMING (OOP) PARADIGM
// Encapsulates logic, state, and behaviors into a class.
class PortfolioApp{
    constructor(data) {
        this.data = data;

        // Category IDs per tab (from cv.json)
        this.tabCategories = {
            cs_Tab:     [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            film_Tab:   [],
            trader_Tab: []
        };
    }

    // FUNCTIONAL PROGRAMMING PARADIGMS 
    // Functional: Use of pure functions, map(), and filter() without mutating data.
    renderCV(targetId, categoryIds){
        const container = document.getElementById(targetId);
        if (!container || !this.data || !this.data.categories) return;

        // Functional: Filter active categories that belong to this tab
        const cats = categoryIds
            ? this.data.categories.filter(c => c.is_active && categoryIds.includes(c.id))
            : this.data.categories.filter(c => c.is_active);

        // Functional & Declarative: Transform data arrays into an HTML string
        const htmlContent = cats.map(cat => {
            let itemsHtml = '';

            if (cat.items){
                // Filter active items and map them to list items
                const activeItems = cat.items.filter(item => item.is_active);
                itemsHtml = `<ul>${activeItems.map(item => `<li>${item.detail}</li>`).join('')}</ul>`;
            } else if (cat.content){
                itemsHtml = `<p>${cat.content}</p>`;
            }

            return `
                <div class="cv-category" style="margin-bottom: 20px;">
                    <h3 style="color: var(--text-color); border-bottom: 1px solid #ccc; padding-bottom: 5px;">
                        ${cat.category_name}
                    </h3>
                    ${itemsHtml}
                </div>
            `;
        }).join('');

        container.innerHTML = htmlContent;
    }
    // Initialize all components
    init(){
        this.renderCV('cv-display',          this.tabCategories.cs_Tab);
        //this.renderCV('film-cv-display',     this.tabCategories.film_Tab);
        this.renderTradingFlows();
    }

    // Implementation for the Trading Tab
    renderTradingFlows(){
        const container = document.getElementById('trader-flows');
        if (!container) return;

        // Options expiration date formatter
        // numbers + letters: day (number) + month abbreviation (string) + 2-digit year (number)
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        const formatExpDate = ({ day, monthIndex, year }) =>
            `${day}${months[monthIndex]}${year % 100}`;
        //   17      JAN               25    →  "17JAN25"

        // Simulating institutional block trades
        // expDate: { day, monthIndex (0-11), year }
        const tapeFlows = [
            { ticker: 'SHOP', type: 'CALL', volume: 45000, premium: '$86M',  strike: 100,
              expDate: { day: 20, monthIndex: 5, year: 2025 } },
            { ticker: 'PLTR', type: 'PUT',  volume: 1200,  premium: '$300K', strike: 175,
              expDate: { day: 18, monthIndex: 6, year: 2025 } },
            { ticker: 'VIX',  type: 'CALL', volume: 40000, premium: '$950K', strike: 185,
              expDate: { day: 16, monthIndex: 7, year: 2025 } },
            { ticker: 'SPY',  type: 'PUT',  volume: 15000, premium: '$4.5M', strike: 700,
              expDate: { day: 19, monthIndex: 8, year: 2025 } }
        ];

        // Functional: Filter high-volume institutional flows (Volume > 3000)
        const highVolumeFlows = tapeFlows.filter(flow => flow.volume > 3000);

        // Declarative UI construction
        const flowsHtml = highVolumeFlows.map(flow => {
            const color   = flow.type === 'CALL' ? '#4CAF50' : '#F44336';
            const expLabel = formatExpDate(flow.expDate);

            return `
                <div style="background: rgba(0,0,0,0.05); padding: 10px; margin: 10px 0;
                            border-left: 5px solid ${color}; border-radius: 5px;">
                    <strong>${flow.ticker}</strong> |
                    ${flow.type} |
                    Stk: $${flow.strike} |
                    Vol: ${flow.volume.toLocaleString()} |
                    Premium: ${flow.premium} |
                    Exp: ${expLabel}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div style="margin-top: 20px; text-align: left; background: white; padding: 20px;
                        border-radius: 15px; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3> Unusual Whales / Dark Pool Activity (Vol > 10K)</h3>
                ${flowsHtml}
                <p style="font-size:0.82rem; color:#888; margin-top:16px; margin-bottom:0;">
                    Functional paradigm · <code>Array.filter()</code> isolates high-volume flows without mutating the original dataset;
                    <code>Array.map()</code> then transforms each trade object into an HTML string declaratively.
                    No loops, no side effects — the output is derived entirely from the input data.
                </p>
            </div>
        `;
    }
}

// EVENT-DRIVEN PROGRAMMING
// Global functions reacting to user inputs (clicks)
window.switchTab = function(tabName, btnElement){
    document.documentElement.setAttribute('data-theme', tabName);
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    btnElement.classList.add('active');
}

// downloadCVasPDF accepts the target ID so each tab can export its own CV
window.downloadCVasPDF = function(targetId = 'cv-display'){
    const element = document.getElementById(targetId);
    const options = {
        margin:      15,
        filename:    `J_Pagan_${targetId}.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
}

// Main execution block when the  Document Object Model (DOM) is ready
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Loads JSON
    const data = await loadPortfolioData();
    
    // 2. If the data was successfully loaded, instiate the class and start it
    if (data) {
        const app = new PortfolioApp(data);
        app.init(); // 3. Calls renderCV & renderTradingFlows
    }
});