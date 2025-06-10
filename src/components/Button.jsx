
function Button ({title, color, click}) {
    return (
        <button onClick={click} className={`text-white ${color} ? ${color} : bg-fourth rounded-lg font-semibold px-4 py-1.5 cursor-pointer text-center`} >{title}</button>
    )
}

export default Button;