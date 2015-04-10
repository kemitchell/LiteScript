'Generated by LiteScript compiler v0.8.9, source: interfaces/shims.lite.md
' -----------
Module shims
' -----------
'## utility methods appended to core classes & namespaces

'Helper methods to class String.
'Also add 'remove' & 'clear' to class Array

    '    append to class String
    Partial Class String
    

        'shim method startsWith(text:string)
        ' ---------------------------
        Public Function startsWith (text)
            'return this.slice(0, text.length) is text
            return Me.slice(0, text.length) = text
        end function

        'shim method endsWith(text:string)
        ' ---------------------------
        Public Function endsWith (text)
            'return this.slice(-text.length) is text
            return Me.slice(-text.length) = text
        end function

        'shim method trimRight()
        ' ---------------------------
        Public Function trimRight ()
            'if no this.length into var inx, return this //empty str
            Dim inx as Object
            if Not(Assign(inx,Me.length)) Then return Me
            'do
            do 
            
                'inx--
                inx--
            Loop while inx >= 0 AndAlso Me.charAt(inx) = " "
            'return this.slice(0,inx+1)
            return Me.slice(0, inx + 1)
        end function

        'shim method trimLeft()
        ' ---------------------------
        Public Function trimLeft ()
            'if no this.length into var len, return this
            Dim len as Object
            if Not(Assign(len,Me.length)) Then return Me
            'var inx=0
            Dim inx = 0
            'while inx<len and this.charAt(inx) is ' '
            Do whileinx < len AndAlso Me.charAt(inx) = " "
            
                'inx++
                inx++
            
            Loop
            'return this.slice(inx)
            return Me.slice(inx)
        end function

'.capitalized

        'method capitalized returns string
        ' ---------------------------
        Public Function capitalized ()
           'if this, return "#{this.charAt(0).toUpperCase()}#{this.slice(1)}"
           if Me Then return "" + (Me.charAt(0).toUpperCase()) + (Me.slice(1))
        end function

'.replaceAll, equiv. to .replace(/./g, newStr)

        'shim method replaceAll(searched,newStr)
        ' ---------------------------
        Public Function replaceAll (searched, newStr)
           'return this.replace(new RegExp(searched,"g"), newStr)
           return Me.replace(new RegExp(searched, "g"), newStr)
        end function

'.countSpaces()

        'shim method countSpaces()
        ' ---------------------------
        Public Function countSpaces ()
            'var inx=0
            Dim inx = 0
            'while inx<this.length
            Do whileinx < Me.length
            
                'if this.charAt(inx) isnt ' ', break
                if Me.charAt(inx) <> " " Then break
                'inx++
                inx++
            
            Loop

            'return inx
            return inx
        end function

'.quoted(quotechar)

        'method quoted(quoteChar)
        ' ---------------------------
        Public Function quoted (quoteChar)
            'return '#{quoteChar}#{this}#{quoteChar}'
            return "" + quoteChar + Me + quoteChar
        end function

        'shim method rpad(howMany)
        ' ---------------------------
        Public Function rpad (howMany)
            'return .concat(String.spaces(howMany-.length))
            return Me.concat(String.spaces(howMany - Me.length))
        end function

'repeat(howMany)

        'shim method repeat(howMany)
        ' ---------------------------
        Public Function repeat (howMany)
            'if howMany<=0, return ''
            if howMany <= 0 Then return ""

            'var a=''
            Dim a = ""
            'while howMany--
            Do whilehowMany--
            
                'a &= this
                a &= Me
            
            Loop

            'return a
            return a
        end function
        
    
    End Class 'partial

    '    append to namespace String
    Partial Class String
    

        'shim method spaces(howMany)
        ' ---------------------------
        Public Function spaces (howMany)
            'return " ".repeat(howMany)
            return " ".repeat(howMany)
        end function

'Checks if a name is Capitalized, unicode aware.
'capitalized is like: /^[A-Z]+[$_a-z0-9]+$/ ,but unicode aware.

        'method isCapitalized(text:string) returns boolean
        ' ---------------------------
        Public Function isCapitalized (text)
            'if text and text.charAt(0) is text.charAt(0).toUpperCase()
            if text AndAlso text.charAt(0) = text.charAt(0).toUpperCase() Then
            
                'if text.length is 1, return true;
                if text.length = 1 Then return true

                'for n=1 while n<text.length
                Dim n As Integer =1
                n < text.lengthDo While 
                
                    'if text.charAt(n) is text.charAt(n).toLowerCase(), return true
                    if text.charAt(n) = text.charAt(n).toLowerCase() Then return true
                
                n+=1
                Loop
                
            
            End if

            'return false
            return false
        end function

'String.findMatchingPair(text,start,closer).
'Note: text[start] MUST be the opener char

        'method findMatchingPair(text:string, start, closer)
        ' ---------------------------
        Public Function findMatchingPair (text, start, closer)
            'var opener=text.charAt(start);
            Dim opener = text.charAt(start)
            'var opencount=1;
            Dim opencount = 1
            'for n=start+1 while n<text.length
            Dim n As Integer =start + 1
            n < text.lengthDo While 
            
                'if text.charAt(n) is closer and --opencount is 0
                if text.charAt(n) = closer AndAlso --opencount = 0 Then
                
                    'return n
                    return n
                
                'if text.charAt(n) is closer and --opencount is 0
                
                elseif text.charAt(n) = opener Then
                
                    'opencount++
                    opencount++
                
                End if
                End if
                
            
            n+=1
            Loop

            'return -1
            return -1
        end function
        
    
    End Class 'partial



    '    append to class Array
    Partial Class Array
    

'method .remove(element)

        'shim method remove(element)  [not enumerable]
        ' ---------------------------
        Public Function remove (element)

            'if this.indexOf(element) into var inx >= 0
            Dim inx as Object
            if Assign(inx,Me.indexOf(element)) >= 0 Then
            
                 'return this.splice(inx,1)
                 return Me.splice(inx, 1)
            
            End if
            
        end function
        
        ,enumerable:false
        })


        'shim method clear       [not enumerable]
        ' ---------------------------
        Public Function clear ()
            '//empty the array
            'for n=1 to .length
            for n As Integer =1n to Me.length
                '.pop
                Me.pop()
            
            Next
            
        end function
        
        ,enumerable:false
        })
    
    End Class 'partial' -----------
' Module code
' -----------
end module