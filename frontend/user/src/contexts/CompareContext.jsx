import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CompareContext = createContext();

export function CompareProvider({ children }) {
 const [compareList, setCompareList] = useState([]);
 const { addToast } = useToast();

 useEffect(() => {
 const saved = localStorage.getItem("compareList");
 if (saved) {
 try {
 setCompareList(JSON.parse(saved));
 } catch (e) {
 console.error("Lỗi parse compareList", e);
 }
 }
 }, []);

 const saveToStorage = (list) => {
 localStorage.setItem("compareList", JSON.stringify(list));
 };

 const addToCompare = (product) => {
 if (compareList.find((p) => p.id === product.id)) {
 addToast("Sản phẩm đã có trong danh sách so sánh", "info");
 return false;
 }
 if (compareList.length >= 3) {
 addToast("Chỉ có thể so sánh tối đa 3 sản phẩm", "warning");
 return false;
 }
 const newList = [...compareList, {
 id: product.id,
 name: product.name,
 price: product.price,
 imageUrl: product.images?.[0]?.imageUrl || "",
 brandName: product.brandName,
 categoryName: product.categoryName,
 movement: product.movement,
 caseSize: product.caseSize,
 caseMaterial: product.caseMaterial,
 crystal: product.crystal,
 waterResistance: product.waterResistance
 }];
 setCompareList(newList);
 saveToStorage(newList);
 addToast("Đã thêm vào danh sách so sánh", "success");
 return true;
 };

 const removeFromCompare = (productId) => {
 const newList = compareList.filter((p) => p.id !== productId);
 setCompareList(newList);
 saveToStorage(newList);
 };

 const clearCompare = () => {
 setCompareList([]);
 localStorage.removeItem("compareList");
 };

 const isInCompare = (productId) => {
 return compareList.some((p) => p.id === productId);
 };

 return (
 <CompareContext.Provider
 value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
 >
 {children}
 </CompareContext.Provider>
 );
}

export const useCompare = () => useContext(CompareContext);
