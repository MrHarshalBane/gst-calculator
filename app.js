// GST Calculator Main Engine JavaScript (India 2026+)

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        amount: 10000,
        rate: 18,
        mode: 'exclusive', // 'exclusive' or 'inclusive'
        transactionType: 'intra', // 'intra' (CGST+SGST) or 'inter' (IGST)
        customRate: '',
        isCustom: false,
        theme: localStorage.getItem('gst_theme') || 'light',
        items: [], // For multi-item invoice calculator
        hsnSearchQuery: '',
        hsnFilterCategory: 'all'
    };

    // DOM Elements
    const amountInput = document.getElementById('amountInput');
    const customRateInput = document.getElementById('customRateInput');
    const customRateWrapper = document.getElementById('customRateWrapper');
    const modeExclusiveBtn = document.getElementById('modeExclusiveBtn');
    const modeInclusiveBtn = document.getElementById('modeInclusiveBtn');
    const txIntraBtn = document.getElementById('txIntraBtn');
    const txInterBtn = document.getElementById('txInterBtn');
    const ratePills = document.querySelectorAll('.rate-pill');
    
    // Result displays
    const displayNetPrice = document.getElementById('displayNetPrice');
    const displayTotalGst = document.getElementById('displayTotalGst');
    const displayGrossPrice = document.getElementById('displayGrossPrice');
    const displayCgstRow = document.getElementById('displayCgstRow');
    const displaySgstRow = document.getElementById('displaySgstRow');
    const displayIgstRow = document.getElementById('displayIgstRow');
    const displayCgstAmount = document.getElementById('displayCgstAmount');
    const displaySgstAmount = document.getElementById('displaySgstAmount');
    const displayIgstAmount = document.getElementById('displayIgstAmount');
    const displayCgstRate = document.getElementById('displayCgstRate');
    const displaySgstRate = document.getElementById('displaySgstRate');
    const displayIgstRate = document.getElementById('displayIgstRate');
    
    // Formula Breakdown elements
    const formulaTitle = document.getElementById('formulaTitle');
    const formulaStep1 = document.getElementById('formulaStep1');
    const formulaStep2 = document.getElementById('formulaStep2');

    // Multi-item DOM elements
    const itemNameInput = document.getElementById('itemNameInput');
    const itemPriceInput = document.getElementById('itemPriceInput');
    const itemQtyInput = document.getElementById('itemQtyInput');
    const itemRateSelect = document.getElementById('itemRateSelect');
    const itemModeSelect = document.getElementById('itemModeSelect');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsTableBody = document.getElementById('itemsTableBody');
    const emptyItemsMessage = document.getElementById('emptyItemsMessage');
    const clearAllItemsBtn = document.getElementById('clearAllItemsBtn');

    // Multi-item Totals
    const cartTotalNet = document.getElementById('cartTotalNet');
    const cartTotalGst = document.getElementById('cartTotalGst');
    const cartTotalGross = document.getElementById('cartTotalGross');

    // Chart Instance
    let chartInstance = null;

    // Theme setup
    if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            state.theme = isDark ? 'dark' : 'light';
            localStorage.setItem('gst_theme', state.theme);
            updateThemeIcon(isDark);
            updateChart();
        });
    }

    function updateThemeIcon(isDark) {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun text-yellow-400 text-xl' : 'fas fa-moon text-slate-600 text-xl';
        }
    }

    // Number Formatter (Indian Currency ₹ 1,00,000.00)
    function formatCurrency(val) {
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(num);
    }

    function formatNumberOnly(val) {
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(num);
    }

    // Calculation Engine
    function calculateGST(amount, ratePercentage, isInclusive) {
        const amt = Math.max(0, parseFloat(amount) || 0);
        const rate = Math.max(0, parseFloat(ratePercentage) || 0);

        let netAmount = 0;
        let totalGst = 0;
        let grossAmount = 0;

        if (isInclusive) {
            // Amount provided is Gross Amount (Price including GST)
            grossAmount = amt;
            netAmount = grossAmount / (1 + rate / 100);
            totalGst = grossAmount - netAmount;
        } else {
            // Amount provided is Net Amount (Base Price excluding GST)
            netAmount = amt;
            totalGst = (netAmount * rate) / 100;
            grossAmount = netAmount + totalGst;
        }

        const halfGst = totalGst / 2;
        const halfRate = rate / 2;

        return {
            netAmount: parseFloat(netAmount.toFixed(2)),
            totalGst: parseFloat(totalGst.toFixed(2)),
            grossAmount: parseFloat(grossAmount.toFixed(2)),
            cgst: parseFloat(halfGst.toFixed(2)),
            sgst: parseFloat(halfGst.toFixed(2)),
            igst: parseFloat(totalGst.toFixed(2)),
            halfRate: halfRate,
            rate: rate
        };
    }

    // Main Update Function
    function updateCalculator() {
        const currentRate = state.isCustom ? (parseFloat(state.customRate) || 0) : state.rate;
        const isInclusive = state.mode === 'inclusive';

        const result = calculateGST(state.amount, currentRate, isInclusive);

        // Render Values
        if (displayNetPrice) displayNetPrice.textContent = formatCurrency(result.netAmount);
        if (displayTotalGst) displayTotalGst.textContent = formatCurrency(result.totalGst);
        if (displayGrossPrice) displayGrossPrice.textContent = formatCurrency(result.grossAmount);

        if (state.transactionType === 'intra') {
            if (displayCgstRow) displayCgstRow.classList.remove('hidden');
            if (displaySgstRow) displaySgstRow.classList.remove('hidden');
            if (displayIgstRow) displayIgstRow.classList.add('hidden');

            if (displayCgstAmount) displayCgstAmount.textContent = formatCurrency(result.cgst);
            if (displaySgstAmount) displaySgstAmount.textContent = formatCurrency(result.sgst);
            if (displayCgstRate) displayCgstRate.textContent = `(${result.halfRate}%)`;
            if (displaySgstRate) displaySgstRate.textContent = `(${result.halfRate}%)`;
        } else {
            if (displayCgstRow) displayCgstRow.classList.add('hidden');
            if (displaySgstRow) displaySgstRow.classList.add('hidden');
            if (displayIgstRow) displayIgstRow.classList.remove('hidden');

            if (displayIgstAmount) displayIgstAmount.textContent = formatCurrency(result.igst);
            if (displayIgstRate) displayIgstRate.textContent = `(${result.rate}%)`;
        }

        // Update Formula Explanation
        updateFormulaExplanation(result, currentRate, isInclusive);

        // Update Doughnut Chart
        updateChart(result.netAmount, result.totalGst);
    }

    function updateFormulaExplanation(result, rate, isInclusive) {
        if (!formulaTitle || !formulaStep1 || !formulaStep2) return;

        if (isInclusive) {
            formulaTitle.textContent = "GST Inclusive Extraction Formula";
            formulaStep1.innerHTML = `<strong>Net Amount</strong> = Total Amount / (1 + GST Rate / 100)<br><code class="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono">₹ ${formatNumberOnly(result.grossAmount)} / (1 + ${rate}/100) = ₹ ${formatNumberOnly(result.netAmount)}</code>`;
            formulaStep2.innerHTML = `<strong>GST Tax Amount</strong> = Total Amount - Net Amount<br><code class="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono">₹ ${formatNumberOnly(result.grossAmount)} - ₹ ${formatNumberOnly(result.netAmount)} = ₹ ${formatNumberOnly(result.totalGst)}</code>`;
        } else {
            formulaTitle.textContent = "GST Exclusive Addition Formula";
            formulaStep1.innerHTML = `<strong>GST Tax Amount</strong> = (Net Amount × GST Rate) / 100<br><code class="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono">(₹ ${formatNumberOnly(result.netAmount)} × ${rate}) / 100 = ₹ ${formatNumberOnly(result.totalGst)}</code>`;
            formulaStep2.innerHTML = `<strong>Gross Total</strong> = Net Amount + GST Tax Amount<br><code class="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded font-mono">₹ ${formatNumberOnly(result.netAmount)} + ₹ ${formatNumberOnly(result.totalGst)} = ₹ ${formatNumberOnly(result.grossAmount)}</code>`;
        }
    }

    // Chart rendering via Chart.js
    function updateChart(net = 10000, gst = 1800) {
        const ctx = document.getElementById('gstDoughnutChart');
        if (!ctx) return;

        const isDark = document.documentElement.classList.contains('dark');
        const netColor = isDark ? '#38bdf8' : '#0284c7';
        const gstColor = isDark ? '#2dd4bf' : '#0d9488';

        if (chartInstance) {
            chartInstance.data.datasets[0].data = [net, gst];
            chartInstance.data.datasets[0].backgroundColor = [netColor, gstColor];
            chartInstance.update();
        } else if (typeof Chart !== 'undefined') {
            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Net Price (Base)', 'GST Tax Amount'],
                    datasets: [{
                        data: [net, gst],
                        backgroundColor: [netColor, gstColor],
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.label}: ${formatCurrency(context.raw)}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Event Listeners for Input
    if (amountInput) {
        amountInput.addEventListener('input', (e) => {
            state.amount = e.target.value;
            updateCalculator();
        });
    }

    if (customRateInput) {
        customRateInput.addEventListener('input', (e) => {
            state.customRate = e.target.value;
            updateCalculator();
        });
    }

    // Mode Toggle Buttons (Exclusive vs Inclusive)
    if (modeExclusiveBtn && modeInclusiveBtn) {
        modeExclusiveBtn.addEventListener('click', () => {
            state.mode = 'exclusive';
            modeExclusiveBtn.classList.add('bg-teal-600', 'text-white', 'shadow-md');
            modeExclusiveBtn.classList.remove('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
            modeInclusiveBtn.classList.remove('bg-teal-600', 'text-white', 'shadow-md');
            modeInclusiveBtn.classList.add('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
            updateCalculator();
        });

        modeInclusiveBtn.addEventListener('click', () => {
            state.mode = 'inclusive';
            modeInclusiveBtn.classList.add('bg-teal-600', 'text-white', 'shadow-md');
            modeInclusiveBtn.classList.remove('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
            modeExclusiveBtn.classList.remove('bg-teal-600', 'text-white', 'shadow-md');
            modeExclusiveBtn.classList.add('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
            updateCalculator();
        });
    }

    // Transaction Type Buttons (Intra-state vs Inter-state)
    if (txIntraBtn && txInterBtn) {
        txIntraBtn.addEventListener('click', () => {
            state.transactionType = 'intra';
            txIntraBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
            txIntraBtn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            txInterBtn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
            txInterBtn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            updateCalculator();
        });

        txInterBtn.addEventListener('click', () => {
            state.transactionType = 'inter';
            txInterBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
            txInterBtn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            txIntraBtn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
            txIntraBtn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            updateCalculator();
        });
    }

    // Rate Pill Click Handlers
    ratePills.forEach(pill => {
        pill.addEventListener('click', () => {
            ratePills.forEach(p => p.classList.remove('active-rate-pill', 'bg-teal-600', 'text-white', 'border-teal-600'));
            ratePills.forEach(p => p.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-transparent'));

            pill.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-transparent');
            pill.classList.add('active-rate-pill', 'bg-teal-600', 'text-white', 'border-teal-600');

            const rateVal = pill.getAttribute('data-rate');
            if (rateVal === 'custom') {
                state.isCustom = true;
                if (customRateWrapper) customRateWrapper.classList.remove('hidden');
                if (customRateInput) customRateInput.focus();
            } else {
                state.isCustom = false;
                state.rate = parseFloat(rateVal);
                if (customRateWrapper) customRateWrapper.classList.add('hidden');
            }
            updateCalculator();
        });
    });

    // Copy Summary to Clipboard
    const copySummaryBtn = document.getElementById('copySummaryBtn');
    if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', () => {
            const currentRate = state.isCustom ? (parseFloat(state.customRate) || 0) : state.rate;
            const isInclusive = state.mode === 'inclusive';
            const result = calculateGST(state.amount, currentRate, isInclusive);

            let text = `📊 GST Calculation Summary (India)\n`;
            text += `------------------------------------\n`;
            text += `Mode: ${isInclusive ? 'Inclusive (GST Included)' : 'Exclusive (Add GST)'}\n`;
            text += `GST Rate: ${currentRate}%\n`;
            text += `Transaction Type: ${state.transactionType === 'intra' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}\n\n`;
            text += `Net Base Amount: ${formatCurrency(result.netAmount)}\n`;
            text += `Total GST Tax: ${formatCurrency(result.totalGst)}\n`;

            if (state.transactionType === 'intra') {
                text += `  • CGST (${result.halfRate}%): ${formatCurrency(result.cgst)}\n`;
                text += `  • SGST (${result.halfRate}%): ${formatCurrency(result.sgst)}\n`;
            } else {
                text += `  • IGST (${result.rate}%): ${formatCurrency(result.igst)}\n`;
            }

            text += `------------------------------------\n`;
            text += `Grand Total Amount: ${formatCurrency(result.grossAmount)}\n`;
            text += `Generated via GST Calculator 2026+`;

            navigator.clipboard.writeText(text).then(() => {
                showToast("Calculation summary copied to clipboard!");
            }).catch(err => {
                showToast("Failed to copy. Please allow clipboard access.", true);
            });
        });
    }

    // Print / PDF Export Handler
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Toast Notification System
    function showToast(message, isError = false) {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            isError 
            ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
        }`;
        
        toast.innerHTML = `
            <i class="fas ${isError ? 'fa-exclamation-circle text-rose-500' : 'fa-check-circle text-emerald-500'} text-base"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm';
        document.body.appendChild(container);
        return container;
    }

    // ==========================================
    // Multi-Item Invoice Calculator Logic
    // ==========================================
    function renderItemsTable() {
        if (!itemsTableBody || !emptyItemsMessage) return;

        if (state.items.length === 0) {
            itemsTableBody.innerHTML = '';
            emptyItemsMessage.classList.remove('hidden');
            updateCartTotals();
            return;
        }

        emptyItemsMessage.classList.add('hidden');
        itemsTableBody.innerHTML = state.items.map((item, idx) => {
            const result = calculateGST(item.price * item.qty, item.rate, item.mode === 'inclusive');
            return `
                <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        ${escapeHtml(item.name)}
                        <div class="text-xs text-slate-400 font-normal">${item.mode === 'inclusive' ? 'GST Incl.' : 'GST Excl.'}</div>
                    </td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono-num text-right">₹ ${formatNumberOnly(item.price)}</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-400 text-center font-mono-num">${item.qty}</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-400 text-center">${item.rate}%</td>
                    <td class="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono-num text-right font-medium">₹ ${formatNumberOnly(result.netAmount)}</td>
                    <td class="py-3 px-4 text-teal-600 dark:text-teal-400 font-mono-num text-right font-medium">₹ ${formatNumberOnly(result.totalGst)}</td>
                    <td class="py-3 px-4 text-slate-900 dark:text-white font-mono-num text-right font-bold">₹ ${formatNumberOnly(result.grossAmount)}</td>
                    <td class="py-3 px-4 text-center">
                        <button data-index="${idx}" class="delete-item-btn text-rose-500 hover:text-rose-700 p-1 rounded transition-colors" title="Delete Item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                state.items.splice(index, 1);
                renderItemsTable();
                showToast("Item removed from list");
            });
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        let totalNet = 0;
        let totalGst = 0;
        let totalGross = 0;

        state.items.forEach(item => {
            const res = calculateGST(item.price * item.qty, item.rate, item.mode === 'inclusive');
            totalNet += res.netAmount;
            totalGst += res.totalGst;
            totalGross += res.grossAmount;
        });

        if (cartTotalNet) cartTotalNet.textContent = formatCurrency(totalNet);
        if (cartTotalGst) cartTotalGst.textContent = formatCurrency(totalGst);
        if (cartTotalGross) cartTotalGross.textContent = formatCurrency(totalGross);
    }

    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            const name = itemNameInput ? itemNameInput.value.trim() : '';
            const price = parseFloat(itemPriceInput ? itemPriceInput.value : 0) || 0;
            const qty = parseInt(itemQtyInput ? itemQtyInput.value : 1) || 1;
            const rate = parseFloat(itemRateSelect ? itemRateSelect.value : 18) || 0;
            const mode = itemModeSelect ? itemModeSelect.value : 'exclusive';

            if (!name) {
                showToast("Please enter an item description", true);
                if (itemNameInput) itemNameInput.focus();
                return;
            }

            if (price <= 0) {
                showToast("Please enter a valid item price", true);
                if (itemPriceInput) itemPriceInput.focus();
                return;
            }

            state.items.push({ name, price, qty, rate, mode });
            
            // Clear inputs
            if (itemNameInput) itemNameInput.value = '';
            if (itemPriceInput) itemPriceInput.value = '';
            if (itemQtyInput) itemQtyInput.value = '1';
            
            renderItemsTable();
            showToast("Item added successfully");
        });
    }

    if (clearAllItemsBtn) {
        clearAllItemsBtn.addEventListener('click', () => {
            if (state.items.length === 0) return;
            if (confirm("Are you sure you want to clear all items?")) {
                state.items = [];
                renderItemsTable();
                showToast("All items cleared");
            }
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // ==========================================
    // HSN/SAC Code Search & Filter Logic
    // ==========================================
    const hsnSearchInput = document.getElementById('hsnSearchInput');
    const hsnCategorySelect = document.getElementById('hsnCategorySelect');
    const hsnTableBody = document.getElementById('hsnTableBody');

    function renderHSNTable() {
        if (!hsnTableBody || typeof HSN_DATA === 'undefined') return;

        const query = (state.hsnSearchQuery || '').toLowerCase();
        const cat = state.hsnFilterCategory;

        const filtered = HSN_DATA.filter(item => {
            const matchesQuery = item.code.toLowerCase().includes(query) || 
                                 item.description.toLowerCase().includes(query) ||
                                 item.category.toLowerCase().includes(query);
            const matchesCat = cat === 'all' || item.category === cat;
            return matchesQuery && matchesCat;
        });

        if (filtered.length === 0) {
            hsnTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-slate-400 dark:text-slate-500">
                        No HSN/SAC codes found matching your criteria.
                    </td>
                </tr>
            `;
            return;
        }

        hsnTableBody.innerHTML = filtered.map(item => {
            let badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
            if (item.rate === 0) badgeColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
            if (item.rate === 3) badgeColor = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
            if (item.rate === 5) badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
            if (item.rate === 18) badgeColor = "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300";
            if (item.rate === 40) badgeColor = "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";

            return `
                <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">${item.code}</td>
                    <td class="py-3 px-4 text-slate-700 dark:text-slate-300">${item.description}</td>
                    <td class="py-3 px-4 text-xs font-medium text-slate-500 dark:text-slate-400">${item.category}</td>
                    <td class="py-3 px-4">
                        <span class="px-2.5 py-1 rounded-full text-xs font-bold ${badgeColor}">
                            ${item.rate}% GST
                        </span>
                        <button data-rate="${item.rate}" class="apply-hsn-rate-btn ml-2 text-xs text-teal-600 hover:text-teal-700 font-semibold underline">
                            Use Rate
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Apply rate from HSN table directly to calculator
        document.querySelectorAll('.apply-hsn-rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rateVal = parseFloat(e.currentTarget.getAttribute('data-rate'));
                state.isCustom = false;
                state.rate = rateVal;
                
                // Select pill UI
                ratePills.forEach(p => {
                    const r = p.getAttribute('data-rate');
                    if (parseFloat(r) === rateVal) {
                        p.classList.add('active-rate-pill', 'bg-teal-600', 'text-white', 'border-teal-600');
                        p.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-transparent');
                    } else {
                        p.classList.remove('active-rate-pill', 'bg-teal-600', 'text-white', 'border-teal-600');
                        p.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-transparent');
                    }
                });

                if (customRateWrapper) customRateWrapper.classList.add('hidden');
                updateCalculator();
                showToast(`Applied ${rateVal}% GST rate to calculator!`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    if (hsnSearchInput) {
        hsnSearchInput.addEventListener('input', (e) => {
            state.hsnSearchQuery = e.target.value;
            renderHSNTable();
        });
    }

    if (hsnCategorySelect) {
        hsnCategorySelect.addEventListener('change', (e) => {
            state.hsnFilterCategory = e.target.value;
            renderHSNTable();
        });
    }

    // Populate categories in HSN filter dropdown
    function populateHSNCategories() {
        if (!hsnCategorySelect || typeof HSN_DATA === 'undefined') return;
        const categories = Array.from(new Set(HSN_DATA.map(i => i.category)));
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            hsnCategorySelect.appendChild(opt);
        });
    }

    // Initializations
    populateHSNCategories();
    renderHSNTable();
    updateCalculator();
});
