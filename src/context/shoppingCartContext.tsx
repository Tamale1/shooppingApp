import { ReactNode, createContext, useContext, useState } from "react"
import { Shoppingcart } from "../components/ShoppingCart"
import { useLocalStorage } from "../hooks/useLocalStorage"
type  ShoppingCartProviderProps={
    children:ReactNode
}
type cartItem={
id: number
quantity: number
}

type shoppingCartContext ={
    openCart:()=>void
    closeCart:()=>void
getItemQuantity:(id:number)=>number
increaseCartQuantity:(id:number)=>void
decreaseCartQuantity:(id:number)=>void
removeFromCart:(id:number)=>void
cartQuantity: number
cartItems: cartItem[]

}

// this is the radio that listens to the context
const ShoppingcartContext = createContext({} as shoppingCartContext)
export function useShoppingCart(){
    return useContext(ShoppingcartContext)
}
//this is the radio station thta broadcasts the context
export function ShoppingCartProvider({children}:ShoppingCartProviderProps){
    const [cartItems, setCartItems] =
     useLocalStorage<cartItem[]>('shopping_cart',[])

    const[isOpen, setIsOpen]= useState(false)
    
    const cartQuantity= cartItems.reduce((quantity,item)=>item.quantity + quantity,  0)
    const openCart=() =>setIsOpen(true)
    const closeCart=() =>setIsOpen(false)
  
    function getItemQuantity(id:number){
    return cartItems.find(item=> item.id===id)?.quantity || 0
    }

    function increaseCartQuantity(id:number){
        setCartItems(currItem=>{
            if(currItem.find(item=>item.id===id)==null){
            return [...currItem,{id, quantity:1}]
            }else{
            return currItem.map(item=>{
                if(item.id ===id){
                return {...item, quantity: item.quantity+1}
                }else{
                return item
                }
            })
            }
        })
        }

        
    function decreaseCartQuantity(id:number){
        setCartItems(currItem=>{
            if(currItem.find(item=>item.id===id)?.quantity===1){
            return currItem.filter(item=>item.id !==id)
            }else{
            return currItem.map(item=>{
                if(item.id ===id){
                return {...item, quantity: item.quantity -1}
                }else{
                return item 
                }
            })
            }
        })
        }

        function removeFromCart(id:number){
            setCartItems(currItem=>{
                return currItem.filter(item=>item.id !==id)
            })
        }
    
    
        return (
<ShoppingcartContext.Provider value ={{
    getItemQuantity, 
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartItems,
    cartQuantity,
    openCart,
    closeCart
    }}>
        {children}
        <Shoppingcart isOpen={isOpen}/>
    </ShoppingcartContext.Provider>

    )
}
