import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { HO_STORE_CATEGORIES, HO_STORE_ID, SCHOOLS } from '../constants';
import { TransactionType } from '../types';
import { PlusCircle, Save, History, ArrowUpRight, Package, Store, LayoutDashboard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const SCHOOL_CLASSES = [
  "Nursery", "LKG", "UKG", 
  "Class I", "Class II", "Class III", "Class IV", "Class V", 
  "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", 
  "Class XI", "Class XII"
];

interface HOStoreProps {
    viewMode: 'ADD' | 'ISSUE' | 'DASH';
}

export const HOStoreModule: React.FC<HOStoreProps> = ({ viewMode }) => {
    const { addTransaction, getComputedStock, transactions } = useAppStore();
    
    // Get Current Stock for HO Store
    const hoStock = getComputedStock(HO_STORE_ID);

    // Calculate Summary
    const totalItems = hoStock.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalValue = hoStock.reduce((acc, curr) => acc + (curr.quantity * curr.avgValue), 0);
    
    // Chart Data
    const categoryData = HO_STORE_CATEGORIES.map(cat => ({
        name: cat,
        value: hoStock.filter(s => s.category === cat).reduce((acc, curr) => acc + (curr.quantity * curr.avgValue), 0)
    }));

    // Filter transactions for history
    const history = transactions
        .filter(t => t.schoolId === HO_STORE_ID)
        .filter(t => viewMode === 'ADD' ? (t.type === TransactionType.PURCHASE || t.type === TransactionType.OPENING_STOCK) : viewMode === 'ISSUE' ? t.type === TransactionType.ISSUE : true)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 20);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-slate-800 text-white rounded-xl shadow-md">
                <Store size={32} className="text-brand-400" />
                <div>
                    <h2 className="text-xl font-bold">Head Office Central Store</h2>
                    <p className="text-slate-300 text-sm">Independent Inventory Management for Books & Stationery</p>
                </div>
            </div>

            {/* DASHBOARD SUMMARY VIEW */}
            {viewMode === 'DASH' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-semibold mb-2">Total Inventory Value</h3>
                            <p className="text-3xl font-bold text-emerald-600">₹{totalValue.toLocaleString()}</p>
                         </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-semibold mb-2">Total Items in Stock</h3>
                            <p className="text-3xl font-bold text-indigo-600">{totalItems.toLocaleString()} <span className="text-sm font-normal text-gray-400">units</span></p>
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
                         <h3 className="text-lg font-bold text-gray-700 mb-4">Stock Value by Category</h3>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} cursor={{fill: '#f1f5f9'}} />
                                <Bar dataKey="value" fill="#0ea5e9" barSize={60} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ACTION VIEWS */}
            {(viewMode === 'ADD' || viewMode === 'ISSUE') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ACTION FORM */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        {viewMode === 'ADD' ? (
                            <HOAddStockForm addTransaction={addTransaction} />
                        ) : (
                            <HOIssueStockForm addTransaction={addTransaction} hoStock={hoStock} />
                        )}
                    </div>

                    {/* HISTORY TABLE */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6 text-gray-700 border-b pb-4">
                            <History size={24} />
                            <h2 className="text-xl font-bold">Recent {viewMode === 'ADD' ? 'Additions' : 'Issues'}</h2>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Item Details</th>
                                        <th className="px-4 py-3 text-right">Qty</th>
                                        {viewMode === 'ADD' && <th className="px-4 py-3 text-right">Cost</th>}
                                        {viewMode === 'ISSUE' && <th className="px-4 py-3">Issued To</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">No records found</td></tr>
                                    ) : (
                                        history.map(t => (
                                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900">{t.date}</td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-900">{t.itemName}</div>
                                                    <div className="text-xs text-gray-500">{t.category} - {t.subCategory}</div>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-bold ${viewMode === 'ADD' ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {viewMode === 'ADD' ? '+' : '-'}{t.quantity}
                                                </td>
                                                {viewMode === 'ADD' && <td className="px-4 py-3 text-right">₹{t.unitPrice}</td>}
                                                {viewMode === 'ISSUE' && <td className="px-4 py-3 text-gray-800">{t.issuedTo}</td>}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* CURRENT STOCK SNAPSHOT (Only for HO Store) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
                 <div className="flex items-center gap-2 mb-6 text-gray-700 border-b pb-4">
                    <Package size={24} />
                    <h2 className="text-xl font-bold">Current Store Inventory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Sub Category / Class</th>
                                <th className="px-6 py-3">Title / Item</th>
                                <th className="px-6 py-3 text-right">Available Qty</th>
                                <th className="px-6 py-3 text-right">Avg Value</th>
                                <th className="px-6 py-3 text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {hoStock.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">Store is empty</td></tr>
                                ) : (
                                    hoStock.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-700">{item.category}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold border border-blue-100">
                                                    {item.subCategory}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{item.itemName}</td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right">₹{item.avgValue.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-medium">₹{(item.quantity * item.avgValue).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const HOAddStockForm = ({ addTransaction }: { addTransaction: any }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: HO_STORE_CATEGORIES[0],
        subCategory: '',
        itemName: '',
        quantity: 1,
        cost: 0
    });
    const [selectedClass, setSelectedClass] = useState(SCHOOL_CLASSES[0]);

    const isBooks = formData.category === 'Books';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalSubCategory = formData.subCategory;
        
        if (isBooks) {
             // For books, subCategory is Class + Optional SubCat
             finalSubCategory = selectedClass;
             if (formData.subCategory.trim()) {
                 finalSubCategory += ` - ${formData.subCategory.trim()}`;
             }
        }

        addTransaction({
            date: formData.date,
            schoolId: HO_STORE_ID, // Special ID for HO Store
            type: TransactionType.PURCHASE,
            category: formData.category,
            subCategory: finalSubCategory,
            itemName: formData.itemName,
            quantity: Number(formData.quantity),
            unitPrice: Number(formData.cost),
            totalValue: Number(formData.quantity) * Number(formData.cost)
        });
        alert("Stock Added to HO Store!");
        setFormData({ ...formData, itemName: '', quantity: 1, cost: 0, subCategory: '' });
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-6 text-brand-700">
                <PlusCircle size={24} />
                <h2 className="text-xl font-bold">Add Stock</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" required className="mt-1 block w-full border rounded-md p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select className="mt-1 block w-full border rounded-md p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {HO_STORE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {isBooks ? (
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Class</label>
                            <select className="mt-1 block w-full border rounded-md p-2" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sub Category (Optional)</label>
                            <input type="text" placeholder="e.g. Subject" className="mt-1 block w-full border rounded-md p-2" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                        <input type="text" required placeholder="e.g. Pens, Markers" className="mt-1 block w-full border rounded-md p-2" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} />
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">{isBooks ? 'Title' : 'Item Name'}</label>
                    <input type="text" required placeholder={isBooks ? "e.g. Mathematics Vol 1" : "e.g. Whiteboard Marker"} className="mt-1 block w-full border rounded-md p-2" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input type="number" required min="1" className="mt-1 block w-full border rounded-md p-2" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cost per Unit (₹)</label>
                        <input type="number" required min="0" className="mt-1 block w-full border rounded-md p-2" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
                    </div>
                </div>
                <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 flex items-center justify-center gap-2 mt-4">
                    <Save size={18} /> Add to Store
                </button>
            </form>
        </div>
    );
};

const HOIssueStockForm = ({ addTransaction, hoStock }: { addTransaction: any, hoStock: any[] }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: '',
        subCategory: '',
        itemName: '',
        quantity: 1,
        issuedTo: 'GBD'
    });

    // Derived dropdown options
    const availableCategories = useMemo(() => Array.from(new Set(hoStock.map(s => s.category))).sort(), [hoStock]);
    
    // Filter Items by Category Only
    const availableItems = useMemo(() => {
        if (!formData.category) return [];
        return hoStock
            .filter(s => s.category === formData.category)
            .sort((a, b) => a.itemName.localeCompare(b.itemName));
    }, [hoStock, formData.category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.itemName) {
            alert("Please select an item");
            return;
        }
        
        const currentItem = hoStock.find((s: any) => s.category === formData.category && s.subCategory === formData.subCategory && s.itemName === formData.itemName);

        if (!currentItem || currentItem.quantity < formData.quantity) {
            alert("Insufficient stock in HO Store!");
            return;
        }

        addTransaction({
            date: formData.date,
            schoolId: HO_STORE_ID,
            type: TransactionType.ISSUE,
            category: formData.category,
            subCategory: formData.subCategory,
            itemName: formData.itemName,
            quantity: Number(formData.quantity),
            issuedTo: formData.issuedTo,
            issuedToId: 'HO_EXTERNAL' 
        });
        alert("Stock Issued from HO Store!");
        setFormData({ ...formData, quantity: 1, issuedTo: 'GBD', itemName: '', subCategory: '' }); 
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) {
            setFormData({...formData, itemName: '', subCategory: ''});
        } else {
            const [sub, name] = val.split('|||');
            setFormData({...formData, subCategory: sub, itemName: name});
        }
    };

    const isStationery = formData.category === 'Stationery';

    return (
        <div>
             <div className="flex items-center gap-2 mb-6 text-amber-600">
                <ArrowUpRight size={24} />
                <h2 className="text-xl font-bold">Issue Stock</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" required className="mt-1 block w-full border rounded-md p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select className="mt-1 block w-full border rounded-md p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subCategory: '', itemName: ''})}>
                            <option value="">-- Select --</option>
                            {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Item</label>
                        <select 
                            required 
                            className="mt-1 block w-full border rounded-md p-2" 
                            value={formData.itemName ? `${formData.subCategory}|||${formData.itemName}` : ''} 
                            onChange={handleItemChange} 
                            disabled={!formData.category}
                        >
                            <option value="">-- Choose Item --</option>
                            {availableItems.map((item: any, idx: number) => (
                                <option key={idx} value={`${item.subCategory}|||${item.itemName}`}>
                                    {item.itemName} ({item.subCategory}) [Avail: {item.quantity}]
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input type="number" required min="1" className="mt-1 block w-full border rounded-md p-2" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issued To</label>
                        {isStationery ? (
                            <select 
                                required
                                className="mt-1 block w-full border rounded-md p-2 bg-white text-blue-700 font-semibold" 
                                value={formData.issuedTo} 
                                onChange={e => setFormData({...formData, issuedTo: e.target.value})}
                            >
                                <option value="GBD">GBD (Default)</option>
                                {SCHOOLS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        ) : (
                            <input type="text" required placeholder="Name / Dept / Branch" className="mt-1 block w-full border rounded-md p-2" value={formData.issuedTo} onChange={e => setFormData({...formData, issuedTo: e.target.value})} />
                        )}
                    </div>
                </div>
                <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 mt-4">
                    <ArrowUpRight size={18} /> Issue Stock
                </button>
            </form>
        </div>
    );
};
