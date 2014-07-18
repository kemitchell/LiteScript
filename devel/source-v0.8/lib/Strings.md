# Strings - namespace helpers

Helper methods added here (Strings), or added to class String. 
Also add 'remove' to class Array

    shim import PMREX

### Append to class String

        shim method startsWith(text:string)
            return this.slice(0, text.length) is text 

        shim method endsWith(text:string)
            return this.slice(-text.length) is text 

        shim method trimRight()
            if no this.length into var inx, return this //empty str
            do
                inx-- 
            loop while inx>=0 and this.charAt(inx) is ' '
            return this.slice(0,inx+1) 

        shim method trimLeft()
            if no this.length into var len, return this
            var inx=0
            while inx<len and this.charAt(inx) is ' '
                inx++
            return this.slice(inx) 

.capitalized

        method capitalized returns string
           if this, return "#{this.charAt(0).toUpperCase()}#{this.slice(1)}"

.replaceAll, equiv. to .replace(/./g, newStr)

        shim method replaceAll(searched,newStr)
           return this.replace(new RegExp(searched,"g"), newStr)

.countSpaces()

        shim method countSpaces()
            var inx=0
            while inx<this.length-1
                if this.charAt(inx) isnt ' ', break
                inx++

            return inx

.quoted(quotechar)

        method quoted(quoteChar)
            return '#{quoteChar}#{this}#{quoteChar}'

        shim method rpad(howMany)
            return .concat(Strings.spaces(howMany-.length))


### Append to class Array

method remove(element)

        method remove(element)  [not enumerable, not writable, configurable]

            if this.indexOf(element) into var inx >= 0
                 return this.splice(inx,1)

        end method

        //property last [not enumerable]
        //    get: function
        //        return .length-1


### namespace Strings

        method spaces(howMany)
            return Strings.repeat(" ",howMany)

repeat(str, howMany)

        shim method repeat(str,howMany)
            
            if howMany<=0, return ""
            
            var a=''
            while howMany--
                a="#{a}#{str}"
            
            return a


Checks if a name is Capitalized, unicode aware.
capitalized is like: /^[A-Z]+[$_a-z0-9]+$/ ,but unicode aware.

        method isCapitalized(text:string) returns boolean 
            if text and text.charAt(0) is text.charAt(0).toUpperCase() 
                if text.length is 1, return true;
                
                for n=1 while n<text.length
                    if text.charAt(n) is text.charAt(n).toLowerCase(), return true
                            
            return false
            
String.findMatchingPair(text,start,closer).
Note: text[start] MUST be the opener char

        method findMatchingPair(text:string, start, closer)
            var opener=text.charAt(start);
            var opencount=1;
            for n=start+1 while n<text.length
                if text.charAt(n) is closer and --opencount is 0 
                    return n
                else if text.charAt(n) is opener 
                    opencount++

            return -1
            
String.replaceQuoted(text,rep)
replace every quoted string inside text, by rep

        method replaceQuoted(text:string, rep:string)

            var p = 0

look for first quote (single or double?),
loop until no quotes found 

            var anyQuote = '"' & "'"

            do while PMREX.findRanges(text,p,anyQuote) into p  < text.length

                if text.slice(p,p+3) is '"""' //ignore triple quotes (valid token)
                    p+=3
                else
                    var quoteNext = PMREX.whileUnescaped(text,p+1,text.charAt(p))
                    if quoteNext<0, break //unmatched quote 

                    text = "#{text.slice(0,p)}#{rep}#{text.slice(quoteNext)}"
                    p+=rep.length

            loop
            
            return text