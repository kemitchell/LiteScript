'Generated by LiteScript compiler v0.8.9, source: interfaces/PMREX.lite.md
' -----------
Module PMREX
' -----------
'PMREX is composed of three functions
'which are simple but enough to tokenize a stream of chars (unicode)

'By using this functions we can avoid Regex Patterns to tokenize

    '    public function whileRanges(chunk:string, rangesStr:string) returns string
    ' ---------------------------
    function whileRanges(chunk, rangesStr)

'whileRanges, advance while the char is in the ranges specified.
'will return string up to first char not in range, or entire string if all chars are in ranges
'e.g.: whileRanges("123ABC","0-9") will return "123"
'e.g.: whileRanges("123ABC","0-9A-Z") will return "123ABC" because all chars are in range

        'var len = chunk.length
        Dim len = chunk.length

        '//normalize ranges
        'var ranges = parseRanges(rangesStr)
        Dim ranges = parseRanges(rangesStr)

        '//advance while in any of the ranges
        'var inx=0
        Dim inx = 0
        'do while inx<len
        Do whileinx < len
        
            'var ch = chunk.charAt(inx)
            Dim ch = chunk.charAt(inx)
            'var isIn=false
            Dim isIn = false
            '//check all ranges
            'for r=0 to ranges.length-1, r+=2
            for r As Integer =0r to ranges.length - 1
                'if ch>=ranges.charAt(r) and ch<=ranges.charAt(r+1)
                if ch >= ranges.charAt(r) AndAlso ch <= ranges.charAt(r + 1) Then
                
                    'isIn=true
                    isIn = true
                    'break
                    break
                
                End if
                
            
            Next
            'end for
            'if not isIn, break
            
            'if not isIn, break
            if Not(isIn) Then break
            'inx++
            inx++
        
        Loop

        'return chunk.slice(0,inx)
        return chunk.slice(0, inx)
    end function


    '    public function untilRanges(chunk:string, rangesStr:string) returns string
    ' ---------------------------
    function untilRanges(chunk, rangesStr)

'untilRanges: advance from start, *until* a char is in one of the specified ranges.
'will return string up to first char *in range* or entire string if there's no match
'e.g.: findRanges("123ABC","A-Z") will return "123"
'e.g.: findRanges("123ABC","C-FJ-L") will return "123AB"

        'var len = chunk.length
        Dim len = chunk.length

        '//normalize ranges
        'var ranges = parseRanges(rangesStr)
        Dim ranges = parseRanges(rangesStr)

        '//advance until match
        'var inx=0
        Dim inx = 0
        'do while inx<len
        Do whileinx < len
        
            'var ch = chunk.charAt(inx)
            Dim ch = chunk.charAt(inx)
            '//check all ranges
            'for r=0 to ranges.length-1, r+=2
            for r As Integer =0r to ranges.length - 1
                'if ch>=ranges.charAt(r) and ch<=ranges.charAt(r+1)
                if ch >= ranges.charAt(r) AndAlso ch <= ranges.charAt(r + 1) Then
                
                    'return chunk.slice(0,inx)
                    return chunk.slice(0, inx)
                
                End if
                
            
            Next
            'end for
            'inx++
            
            'inx++
            inx++
        
        Loop

        'return chunk.slice(0,inx)
        return chunk.slice(0, inx)
    end function

    '    helper function parseRanges(rangesStr:string) returns string
    ' ---------------------------
    function parseRanges(rangesStr)

'Range examples:

'* "1-9" means all chars between 1 and 9 (inclusive)
'* "1-9J-Z" means all chars between 1 and 9 or between "J" and "Z"
'* "1-9JNW" means all chars between 1 and 9, a "J" a "N" or a "W"

'This function returns a normalized range string without "-"
'and composed always from ranges:
'
'    "1-9" => "19"
'    "1-9J-Z" => "19JZ"
'    "1-9JNW" => "19JJNNWW"

        'var result = ""
        Dim result = ""

        '//parse ranges in array [[from,to],[from,to]...]
        'var ch:string
        Dim ch = Nothing
        'var inx=0
        Dim inx = 0
        'while inx<rangesStr.length
        Do whileinx < rangesStr.length
        
            'ch = rangesStr.charAt(inx)
            ch = rangesStr.charAt(inx)
            'result &= ch
            result &= ch
            'if rangesStr.charAt(inx+1) is '-'
            if rangesStr.charAt(inx + 1) = "-" Then
            
                'inx++
                inx++
                'result &= rangesStr.charAt(inx+1)
                result &= rangesStr.charAt(inx + 1)
            
            'if rangesStr.charAt(inx+1) is '-'
            
            else
            
                'result &= ch
                result &= ch
            
            End if
            'inx++
            inx++
        
        Loop

        'return result
        return result
    end function


    '    public function whileUnescaped(chunk:string,endChar:string) returns string
    ' ---------------------------
    function whileUnescaped(chunk, endChar)

'advance until unescaped endChar
'return string up to endChar (excluded)

        'var pos = 0
        Dim pos = 0
        'do
        Do whiletrue
        
            'var inx = chunk.indexOf(endChar,pos)
            Dim inx = chunk.indexOf(endChar, pos)

            'if inx is -1, fail with 'missing closing quote-char: #{endChar} ' // closer not found
            if inx = -1 Then Throw New System.Exception("missing closing quote-char: " + endChar + " ")

            'if inx>0 and chunk.charAt(inx-1) is '\\' #escaped
            if inx > 0 AndAlso chunk.charAt(inx - 1) = "\\" Then
            

                'var countEscape=1
                Dim countEscape = 1
                'while inx>countEscape and chunk.charAt(inx-1-countEscape) is '\\' #escaped-escape
                Do whileinx > countEscape AndAlso chunk.charAt(inx - 1 - countEscape) = "\\"
                
                        'countEscape++
                        countEscape++
                
                Loop

                'if countEscape % 2 is 0 //even, means escaped-escape, means: not escaped
                if countEscape % 2 = 0 Then
                
                    'break    //we found an unescaped quote
                    break
                
                'if countEscape % 2 is 0 //even, means escaped-escape, means: not escaped
                
                else
                
                    'pos=inx+1 //odd means escaped quote, so it's not closing quote
                    pos = inx + 1
                
                End if
                
            
            'if inx>0 and chunk.charAt(inx-1) is '\\' #escaped
            
            else
            
                '//found unescaped
                'break
                break
            
            End if
            
        
        Loop
        'return chunk.slice(0,inx)
        return chunk.slice(0, inx)
    end function

    '    public function quotedContent(chunk:string) returns string
    ' ---------------------------
    function quotedContent(chunk)

'return the string up to the matching quote, excluding both
'Note: chunk[0] MUST be the openinig quote, either single-quote or double-quote

        'if no chunk.charAt(0) in '/"\'', throw "chunk.charAt(0) MUST be the openinig quote-char"
        if Not("/"\'".Contains(chunk.charAt(0))) Then Throw "chunk.charAt(0) MUST be the openinig quote-char"
        'return whileUnescaped(chunk.slice(1),chunk.charAt(0))
        return whileUnescaped(chunk.slice(1), chunk.charAt(0))
    end function
' -----------
' Module code
' -----------
end module