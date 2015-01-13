//Generated by LiteScript compiler v0.8.9, source: ASTBase.lite.md
// -----------
// Module Init
// -----------
//-----------------------------------------

//This module defines the base abstract syntax tree class used by the grammar.
//It's main purpose is to provide utility methods used in the grammar
//for **req**uired tokens, **opt**ional tokens
//and comma or semicolon **Separated Lists** of symbols.

//Dependencies

    //import Parser, ControlledError
    var Parser = require('./Parser.js');
    var ControlledError = require('./lib/ControlledError.js');
    //import logger
    var logger = require('./lib/logger.js');

    //    only export class ASTBase
    // constructor
    function ASTBase(parent, name){
     //     properties

        //parent: ASTBase
        //childs: array of ASTBase

        //name:string, keyword:string

        //type

        //indent = 0

        //lexer: Parser.Lexer

//AST node position in source

        //lineInx
        //sourceLineNum, column

//wile-parsing info

        //locked: boolean
        //extraInfo // if parse failed, extra information
         this.indent=0;

        //.parent = parent
        this.parent = parent;
        //.name = name
        this.name = name;

//Get lexer from parent

        //if parent
        if (parent) {
        
            //.lexer = parent.lexer
            this.lexer = parent.lexer;

//Remember this node source position.
//Also remember line index in tokenized lines, and indent

            //if .lexer
            if (this.lexer) {
            
                //.sourceLineNum = .lexer.sourceLineNum
                this.sourceLineNum = this.lexer.sourceLineNum;
                //.column = .lexer.token.column
                this.column = this.lexer.token.column;
                //.indent = .lexer.indent
                this.indent = this.lexer.indent;
                //.lineInx = .lexer.lineInx
                this.lineInx = this.lexer.lineInx;
            };
        };
     };
     // ---------------------------
     ASTBase.prototype.lock = function(){
//**lock** marks this node as "locked", meaning we are certain this is the right class
//for the given syntax. For example, if the `FunctionDeclaration` class see the token `function`,
//we are certain this is the right class to use, so we 'lock()'.
//Once locked, any **req**uired token not present causes compilation to fail.

        //.locked = true
        this.locked = true;
     }// ---------------------------
     ASTBase.prototype.getParent = function(searchedClass){
//**getParent** method searchs up the AST tree until a specfied node class is found

        //var node = this.parent
        var node = this.parent;
        //while node and node isnt instance of searchedClass
        while(node && !(node instanceof searchedClass)){
            //node = node.parent # move to parent
            node = node.parent;
        };// end loop
        //return node
        return node;
     }// ---------------------------
     ASTBase.prototype.positionText = function(){

        //if not .lexer or no .sourceLineNum, return "(compiler-defined)"
        if (!(this.lexer) || !this.sourceLineNum) {return "(compiler-defined)"};
        //return "#{.lexer.filename}:#{.sourceLineNum}:#{.column or 0}"
        return '' + this.lexer.filename + ":" + this.sourceLineNum + ":" + (this.column || 0);
     }// ---------------------------
     ASTBase.prototype.toString = function(){

        //return "[#{.constructor.name}]"
        return "[" + this.constructor.name + "]";
     }// ---------------------------
     ASTBase.prototype.sayErr = function(msg){

        //logger.error .positionText(), msg
        logger.error(this.positionText(), msg);
     }// ---------------------------
     ASTBase.prototype.warn = function(msg){

        //logger.warning .positionText(), msg
        logger.warning(this.positionText(), msg);
     }// ---------------------------
     ASTBase.prototype.throwError = function(msg){
//**throwError** add node position info and throws a 'controlled' error.

//A 'controlled' error, shows only err.message

//A 'un-controlled' error is an unhandled exception in the compiler code itself,
//and it shows error message *and stack trace*.

        //logger.throwControlled "#{.positionText()}. #{msg}"
        logger.throwControlled('' + (this.positionText()) + ". " + msg);
     }// ---------------------------
     ASTBase.prototype.throwParseFailed = function(msg){
//throws a parseFailed-error

//During a node.parse(), if there is a token mismatch, a "parse failed" is raised.
//"parse failed" signals a failure to parse the tokens from the stream,
//however the syntax might still be valid for another AST node.
//If the AST node was locked-on-target, it is a hard-error.
//If the AST node was NOT locked, it's a soft-error, and will not abort compilation
//as the parent node will try other AST classes against the token stream before failing.

        //var err = new Error("#{.positionText()}. #{msg}")
        //var cErr = new ControlledError("#{.lexer.posToString()}. #{msg}")
        var cErr = new ControlledError('' + (this.lexer.posToString()) + ". " + msg);
        //cErr.soft = not .locked
        cErr.soft = !(this.locked);
        //throw cErr
        throw cErr;
     }// ---------------------------
     ASTBase.prototype.parse = function(){
//abstract method representing the TRY-Parse of the node.
//Child classes _must_ override this method

        //.throwError 'Parser Not Implemented'
        this.throwError('Parser Not Implemented');
     }// ---------------------------
     ASTBase.prototype.produce = function(){
//**produce()** is the method to produce target code
//Target code produces should override this, if the default production isnt: `.out .name`

        //.out .name
        this.out(this.name);
     }// ---------------------------
     ASTBase.prototype.parseDirect = function(key, directMap){

//We use a DIRECT associative array to pick the exact AST node to parse
//based on the actual token value or type.
//This speeds up parsing, avoiding parsing by trial & error

//Check keyword

        //if directMap.get(key) into var param
        var param=undefined;
        if ((param=directMap.get(key))) {
        

//try parse by calling .opt, accept Array as param

            //var statement = param instance of Array ?
                    //ASTBase.prototype.opt.apply(this, param)
                    //: .opt(param)
            var statement = param instanceof Array ? ASTBase.prototype.opt.apply(this, param) : this.opt(param);

//return parsed statement or nothing

            //return statement
            return statement;
        };
     }// ---------------------------
     ASTBase.prototype.opt = function(){
//**opt** (optional) is for optional parts of a grammar. It attempts to parse
//the token stream using one of the classes or token types specified.
//This method takes a variable number of arguments.
//For example:
  //calling `.opt IfStatement, Expression, 'IDENTIFIER'`
  //would attempt to parse the token stream first as an `IfStatement`. If that fails, it would attempt
  //to use the `Expression` class. If that fails, it will accept a token of type `IDENTIFIER`.
  //If all of those fail, it will return `undefined`.

//Method start:
//Remember the actual position, to rewind if all the arguments to `opt` fail

        //var startPos = .lexer.getPos()
        var startPos = this.lexer.getPos();

        //#debug
        //var spaces = .levelIndent()
        var spaces = this.levelIndent();

//For each argument, -a class or a string-, we will attempt to parse the token stream
//with the class, or match the token type to the string.

        //for each searched in arguments.toArray()
        var _list1=Array.prototype.slice.call(arguments);
        for( var searched__inx=0,searched ; searched__inx<_list1.length ; searched__inx++){searched=_list1[searched__inx];
        

//skip empty, null & undefined

          //if no searched, continue
          if (!searched) {continue};

//determine value or type
//For strings we check the token **value** or **TYPE** (if searched is all-uppercase)

          //if typeof searched is 'string'
          if (typeof searched === 'string') {
          

            //declare searched:string
            

            //#debug spaces, .constructor.name,'TRY',searched, 'on', .lexer.token.toString()

            //var isTYPE = searched.charAt(0)>="A" and searched.charAt(0)<="Z" and searched is searched.toUpperCase()
            var isTYPE = searched.charAt(0) >= "A" && searched.charAt(0) <= "Z" && searched === searched.toUpperCase();
            //var found
            var found = undefined;

            //if isTYPE
            if (isTYPE) {
            
              //found = .lexer.token.type is searched
              found = this.lexer.token.type === searched;
            }
            //if isTYPE
            
            else {
              //found = .lexer.token.value is searched
              found = this.lexer.token.value === searched;
            };

            //if found
            if (found) {
            

//Ok, type/value found! now we return: token.value
//Note: we shouldnt return the 'token' object, because returning objects (here and in js)
//is a "pass by reference". You return a "pointer" to the object.
//If we return the 'token' object, the calling function will recive a "pointer"
//and it can inadvertedly alter the token object in the token stream. (it should not, leads to subtle bugs)

              //logger.debug spaces, .constructor.name,'matched OK:',searched, .lexer.token.value
              logger.debug(spaces, this.constructor.name, 'matched OK:', searched, this.lexer.token.value);
              //var result = .lexer.token.value
              var result = this.lexer.token.value;

//Advance a token, .lexer.token always has next token

              //.lexer.nextToken()
              this.lexer.nextToken();
              //return result
              return result;
            };
          }
          //if typeof searched is 'string'
          
          else {

//"searched" is an AST class

            //declare searched:Function //class
            

            //logger.debug spaces, .constructor.name,'TRY',searched.name, 'on', .lexer.token.toString()
            logger.debug(spaces, this.constructor.name, 'TRY', searched.name, 'on', this.lexer.token.toString());

//if the argument is an AST node class, we instantiate the class and try the `parse()` method.
//`parse()` can fail with `ParseFailed` if the syntax do not match

            //try
            try{

                //var astNode:ASTBase = new searched(this) # create required ASTNode, to try parse
                var astNode = new searched(this);

                //astNode.parse() # if it can't parse, will raise an exception
                astNode.parse();

                //logger.debug spaces, 'Parsed OK!->',searched.name
                logger.debug(spaces, 'Parsed OK!->', searched.name);

                //return astNode # parsed ok!, return instance
                return astNode;
            
            }catch(err){
                //if err isnt instance of ControlledError, throw err //re-raise if not ControlledError
                if (!(err instanceof ControlledError)) {throw err};
                //declare err:ControlledError
                

//If parsing fail, but the AST node were not 'locked' on target, (a soft-error),
//we will try other AST nodes.

                //if err.soft
                if (err.soft) {
                
                    //.lexer.softError = err
                    this.lexer.softError = err;
                    //logger.debug spaces, searched.name,'parse failed.',err.message
                    logger.debug(spaces, searched.name, 'parse failed.', err.message);

//rewind the token stream, to try other AST nodes

                    //logger.debug "<<REW to", "#{startPos.sourceLineNum}:#{startPos.token.column or 0} [#{startPos.index}]", startPos.token.toString()
                    logger.debug("<<REW to", '' + startPos.sourceLineNum + ":" + (startPos.token.column || 0) + " [" + startPos.index + "]", startPos.token.toString());
                    //.lexer.setPos startPos
                    this.lexer.setPos(startPos);
                }
                //if err.soft
                
                else {

//else: it's a hard-error. The AST node were locked-on-target.
//We abort parsing and throw.

                    //# the first hard-error is the most informative, the others are cascading ones
                    //if .lexer.hardError is null, .lexer.hardError = err
                    if (this.lexer.hardError === null) {this.lexer.hardError = err};

//raise up, abort parsing

                    //raise err
                    throw err;
                };

                //end if - type of error

            //end catch
                
            };

            //end catch

          //end if - string or class
            
          };

          //end if - string or class

        //end loop - try the next argument
          
        };// end for each in Array.prototype.slice.call(arguments)

        //end loop - try the next argument

//No more arguments.
//`opt` returns `undefined` if none of the arguments can be use to parse the token stream.

        //return undefined
        

//No more arguments.
//`opt` returns `undefined` if none of the arguments can be use to parse the token stream.

        //return undefined
        return undefined;
     }// ---------------------------
     ASTBase.prototype.req = function(){

//**req** (required) if for required symbols of the grammar. It works the same way as `opt`
//except that it throws an error if none of the arguments can be used to parse the stream.

//We first call `opt` to see what we get. If a value is returned, the function was successful,
//so we just return the node that `opt` found.

//else, If `opt` returned nothing, we give the user a useful error.

        //var result = ASTBase.prototype.opt.apply(this,arguments)
        var result = ASTBase.prototype.opt.apply(this, Array.prototype.slice.call(arguments));

        //if no result
        if (!result) {
        
          //.throwParseFailed "#{.constructor.name}:#{.extraInfo or ''} found #{.lexer.token.toString()} but #{.listArgs(arguments)} required"
          this.throwParseFailed('' + this.constructor.name + ":" + (this.extraInfo || '') + " found " + (this.lexer.token.toString()) + " but " + (this.listArgs(Array.prototype.slice.call(arguments))) + " required");
        };

        //return result
        return result;
     }// ---------------------------
     ASTBase.prototype.reqOneOf = function(arr){
//(performance) call req only if next token (value) in list

        //if .lexer.token.value in arr
        if (arr.indexOf(this.lexer.token.value)>=0) {
        
            //return ASTBase.prototype.req.apply(this,arr)
            return ASTBase.prototype.req.apply(this, arr);
        }
        //if .lexer.token.value in arr
        
        else {
            //.throwParseFailed "not in list"
            this.throwParseFailed("not in list");
        };
     }// ---------------------------
     ASTBase.prototype.optList = function(){
//this generic method will look for zero or more of the requested classes,

        //var item
        var item = undefined;
        //var list=[]
        var list = [];

        //do
        while(true){
          //item = ASTBase.prototype.opt.apply(this,arguments)
          item = ASTBase.prototype.opt.apply(this, Array.prototype.slice.call(arguments));
          //if no item then break
          if (!item) {break};
          //list.push item
          list.push(item);
        };// end loop

        //return list.length? list : undefined
        return list.length ? list : undefined;
     }// ---------------------------
     ASTBase.prototype.optSeparatedList = function(astClass, separator, closer){

//Start optSeparatedList

        //var result = []
        var result = [];
        //var optSepar
        var optSepar = undefined;

//except the requested closer is NEWLINE,
//NEWLINE is included as an optional extra separator
//and also we allow a free-form mode list

        //if closer isnt 'NEWLINE' #Except required closer *IS* NEWLINE
        if (closer !== 'NEWLINE') {
        

//if the list starts with a NEWLINE,
//assume an indented free-form mode separated list,
//where NEWLINE is a valid separator.

            //if .lexer.token.type is 'NEWLINE'
            if (this.lexer.token.type === 'NEWLINE') {
            
                //return .optFreeFormList( astClass, separator, closer )
                return this.optFreeFormList(astClass, separator, closer);
            };

//else normal list, but NEWLINE is accepted as optional before and after separator

            //optSepar = 'NEWLINE' #newline is optional before and after separator
            optSepar = 'NEWLINE';
        };

//normal separated list,
//loop until closer found

        //logger.debug "optSeparatedList [#{.constructor.name}] indent:#{.indent}, get SeparatedList of [#{astClass.name}] by '#{separator}' closer:", closer or '-no closer-'
        logger.debug("optSeparatedList [" + this.constructor.name + "] indent:" + this.indent + ", get SeparatedList of [" + astClass.name + "] by '" + separator + "' closer:", closer || '-no closer-');

        //var blockIndent = .lexer.indent
        var blockIndent = this.lexer.indent;
        //var startLine = .lexer.sourceLineNum
        var startLine = this.lexer.sourceLineNum;
        //do until .opt(closer) or .lexer.token.type is 'EOF'
        while(!(this.opt(closer) || this.lexer.token.type === 'EOF')){

//get a item

            //var item = .req(astClass)
            var item = this.req(astClass);
            //.lock()
            this.lock();

//add item to result

            //result.push(item)
            result.push(item);

//newline after item (before comma or closer) is optional

            //var consumedNewLine = .opt(optSepar)
            var consumedNewLine = this.opt(optSepar);

//if, after newline, we got the closer, then exit.

            //if .opt(closer) then break #closer found
            if (this.opt(closer)) {break};

//here, a 'separator' (comma/semicolon) means: 'there is another item'.
//Any token other than 'separator' means 'end of list'

            //if no .opt(separator)
            if (!this.opt(separator)) {
            
                //# any token other than comma/semicolon means 'end of comma separated list'
                //# but if a closer was required, then "other" token is an error
                //if closer, .throwError "Expected '#{closer}' to end list started at line #{startLine}, got '#{.lexer.token.value}'"
                if (closer) {this.throwError("Expected '" + closer + "' to end list started at line " + startLine + ", got '" + this.lexer.token.value + "'")};
                //if consumedNewLine, .lexer.returnToken()
                if (consumedNewLine) {this.lexer.returnToken()};
                //break # if no error, end of list
                break;
            };
            //end if

//optional newline after comma

            //consumedNewLine = .opt(optSepar)
            

//optional newline after comma

            //consumedNewLine = .opt(optSepar)
            consumedNewLine = this.opt(optSepar);
            //if consumedNewLine and .lexer.indent <= blockIndent
            if (consumedNewLine && this.lexer.indent <= blockIndent) {
            
                //.lexer.sayErr "SeparatedList, after '#{separator}' - next line is same or less indented (#{.lexer.indent}) than block indent (#{blockIndent})"
                this.lexer.sayErr("SeparatedList, after '" + separator + "' - next line is same or less indented (" + this.lexer.indent + ") than block indent (" + blockIndent + ")");
                //return result
                return result;
            };
        };// end loop

        //return result
        return result;
     }// ---------------------------
     ASTBase.prototype.optFreeFormList = function(astClass, separator, closer){

//In "freeForm Mode", each item stands in its own line, and commas (separators) are optional.
//The item list ends when a closer is found or when indentation changes

        //var result = []
        var result = [];
        //var lastItemSourceLine = -1
        var lastItemSourceLine = -1;
        //var separatorAfterItem
        var separatorAfterItem = undefined;
        //var parentIndent = .parent.indent or 0
        var parentIndent = this.parent.indent || 0;

//FreeFormList should start with NEWLINE
//First line sets indent level

        //.req "NEWLINE"
        this.req("NEWLINE");
        //var startLine = .lexer.sourceLineNum
        var startLine = this.lexer.sourceLineNum;
        //var blockIndent = .lexer.indent
        var blockIndent = this.lexer.indent;

        //logger.debug "optFreeFormList: [#{astClass.name} #{separator}]*  parent:#{.parent.name}.#{.constructor.name} parentIndent:#{parentIndent}, blockIndent:#{blockIndent}, closer:", closer or '-no-'
        logger.debug("optFreeFormList: [" + astClass.name + " " + separator + "]*  parent:" + this.parent.name + "." + this.constructor.name + " parentIndent:" + parentIndent + ", blockIndent:" + blockIndent + ", closer:", closer || '-no-');

        //if blockIndent <= parentIndent #first line is same or less indented than parent - assume empty list
        if (blockIndent <= parentIndent) {
        
          //.lexer.sayErr "free-form SeparatedList: next line is same or less indented (#{blockIndent}) than parent indent (#{parentIndent}) - assume empty list"
          this.lexer.sayErr("free-form SeparatedList: next line is same or less indented (" + blockIndent + ") than parent indent (" + parentIndent + ") - assume empty list");
          //return result
          return result;
        };

//now loop until closer or an indent change

        //#if closer found (`]`, `)`, `}`), end of list
        //do until .opt(closer) or .lexer.token.type is 'EOF'
        while(!(this.opt(closer) || this.lexer.token.type === 'EOF')){

//check for indent changes

            //logger.debug "freeForm Mode .lexer.indent:#{.lexer.indent} block indent:#{blockIndent} parentIndent:#{parentIndent}"
            logger.debug("freeForm Mode .lexer.indent:" + this.lexer.indent + " block indent:" + blockIndent + " parentIndent:" + parentIndent);
            //if .lexer.indent isnt blockIndent
            if (this.lexer.indent !== blockIndent) {
            

//indent changed:
//if a closer was specified, indent change before the closer means error (line misaligned)

                  //if closer
                  if (closer) {
                  
                    //.lexer.throwErr "Misaligned indent: #{.lexer.indent}. Expected #{blockIndent}, or '#{closer}' to end block started at line #{startLine}"
                    this.lexer.throwErr("Misaligned indent: " + this.lexer.indent + ". Expected " + blockIndent + ", or '" + closer + "' to end block started at line " + startLine);
                  };

//check for excesive indent

                  //if .lexer.indent > blockIndent
                  //  .lexer.throwErr "Misaligned indent: #{.lexer.indent}. Expected #{blockIndent} to continue block, or #{parentIndent} to close block started at line #{startLine}"

//else, if no closer specified, and indent decreased => end of list

                  //break #end of list
                  break;
            };

            //end if

//check for more than one statement on the same line, with no separator

            //if not separatorAfterItem and .lexer.sourceLineNum is lastItemSourceLine
            

//check for more than one statement on the same line, with no separator

            //if not separatorAfterItem and .lexer.sourceLineNum is lastItemSourceLine
            if (!(separatorAfterItem) && this.lexer.sourceLineNum === lastItemSourceLine) {
            
                //.lexer.sayErr "More than one [#{astClass.name}] on line #{lastItemSourceLine}. Missing ( ) on function call?"
                this.lexer.sayErr("More than one [" + astClass.name + "] on line " + lastItemSourceLine + ". Missing ( ) on function call?");
            };

            //lastItemSourceLine = .lexer.sourceLineNum
            lastItemSourceLine = this.lexer.sourceLineNum;

//else, get a item

            //var item = .req(astClass)
            var item = this.req(astClass);
            //.lock()
            this.lock();

//add item to result

            //result.push(item)
            result.push(item);

//newline after item (before comma or closer) is optional

            //.opt('NEWLINE')
            this.opt('NEWLINE');

//separator (comma|semicolon) is optional,
//NEWLINE also is optional and valid

            //separatorAfterItem = .opt(separator)
            separatorAfterItem = this.opt(separator);
            //.opt('NEWLINE')
            this.opt('NEWLINE');
        };// end loop

        //logger.debug "END freeFormMode [#{.constructor.name}] blockIndent:#{blockIndent}, get SeparatedList of [#{astClass.name}] by '#{separator}' closer:", closer or '-no closer-'
        logger.debug("END freeFormMode [" + this.constructor.name + "] blockIndent:" + blockIndent + ", get SeparatedList of [" + astClass.name + "] by '" + separator + "' closer:", closer || '-no closer-');

        //if closer then .opt('NEWLINE') # consume optional newline after closer in free-form mode

        //return result
        return result;
     }// ---------------------------
     ASTBase.prototype.reqSeparatedList = function(astClass, separator, closer){
//**reqSeparatedList** is the same as `optSeparatedList` except that it throws an error
//if the list is empty

//First, call optSeparatedList

        //var result:ASTBase array = .optSeparatedList(astClass, separator, closer)
        var result = this.optSeparatedList(astClass, separator, closer);
        //if result.length is 0, .throwParseFailed "#{.constructor.name}: Get list: At least one [#{astClass.name}] was expected"
        if (result.length === 0) {this.throwParseFailed('' + this.constructor.name + ": Get list: At least one [" + astClass.name + "] was expected")};

        //return result
        return result;
     }// ---------------------------
     ASTBase.prototype.listArgs = function(args){
//listArgs list arguments (from opt or req). used for debugging
//and syntax error reporting

        //var msg = []
        var msg = [];
        //for each i in args
        for( var i__inx=0,i ; i__inx<args.length ; i__inx++){i=args[i__inx];
        

            //declare valid i.name
            

            //if typeof i is 'string'
            if (typeof i === 'string') {
            
                //msg.push("'#{i}'")
                msg.push("'" + i + "'");
            }
            //if typeof i is 'string'
            
            else if (i) {
            
                //if typeof i is 'function'
                if (typeof i === 'function') {
                
                  //msg.push("[#{i.name}]")
                  msg.push("[" + i.name + "]");
                }
                //if typeof i is 'function'
                
                else {
                  //msg.push("<#{i.name}>")
                  msg.push("<" + i.name + ">");
                };
            }
            //else if i
            
            else {
                //msg.push("[null]")
                msg.push("[null]");
            };
        };// end for each in args

        //return msg.join('|')
        return msg.join('|');
     }// ---------------------------
     ASTBase.prototype.out = function(){

//*out* is a helper function for code generation
//It evaluates and output its arguments. uses .lexer.out

        //var rawOut = .lexer.outCode
        var rawOut = this.lexer.outCode;

        //for each item in arguments.toArray()
        var _list2=Array.prototype.slice.call(arguments);
        for( var item__inx=0,item ; item__inx<_list2.length ; item__inx++){item=_list2[item__inx];
        

//skip empty items

          //if no item, continue
          if (!item) {continue};

//if it is the first thing in the line, out indentation

          //if rawOut.currLine.length is 0  and .indent > 0
          if (rawOut.currLine.length === 0 && this.indent > 0) {
          
              //rawOut.put String.spaces(.indent)
              rawOut.put(String.spaces(this.indent));
          };

//if it is an AST node, call .produce()

          //if item instance of ASTBase
          if (item instanceof ASTBase) {
          
              //declare item:ASTBase
              
              //item.produce()
              item.produce();
          }
          //if item instance of ASTBase
          
          else if (item === '\n') {
          
            //rawOut.startNewLine()
            rawOut.startNewLine();
          }
          //else if item is '\n'
          
          else if (typeof item === 'string') {
          
            //rawOut.put item
            rawOut.put(item);
          }
          //else if type of item is 'string'
          
          else if (item instanceof Array) {
          
              //# Recursive #
              //ASTBase.prototype.out.apply this,item
              ASTBase.prototype.out.apply(this, item);
          }
          //else if item instance of Array
          
          else if (item instanceof Object) {
          

            // expected keys:
            //  COMMENT:string, NLI, CSL:Object array, freeForm, h

//{CSL:arr} -> output the array as Comma Separated List (note: CSL can be present and undefined)

              //if item.hasProperty('CSL')
              var comment=undefined;
              var header=undefined;
              if (item.hasProperty('CSL')) {
              

                  //var CSL:array = item.tryGetProperty("CSL")
                  var CSL = item.tryGetProperty("CSL");

                  //if CSL
                  if (CSL) {
                  
                      // additional keys: pre,post,separator
                      //var separator = item.tryGetProperty('separator') or ', '
                      var separator = item.tryGetProperty('separator') || ', ';
                      //var freeFormMode = item.tryGetProperty('freeForm')
                      var freeFormMode = item.tryGetProperty('freeForm');
                      //var newLineIncluded = false
                      var newLineIncluded = false;
                      //var actualIndent = rawOut.getIndent()
                      var actualIndent = rawOut.getIndent();

                      //for each inx,listItem in CSL
                      for( var inx=0,listItem ; inx<CSL.length ; inx++){listItem=CSL[inx];
                      

                            //declare valid listItem.out
                            

                            //if freeFormMode
                            if (freeFormMode) {
                            
                                //rawOut.startNewLine
                                rawOut.startNewLine();
                                //rawOut.put String.spaces(actualIndent+4)
                                rawOut.put(String.spaces(actualIndent + 4));
                                //newLineIncluded = true
                                newLineIncluded = true;
                            };

                            //if inx>0
                            if (inx > 0) {
                            
                                //rawOut.put separator
                                rawOut.put(separator);
                            };

                            //#recurse
                            //.out item.tryGetProperty('pre'), listItem, item.tryGetProperty('post')
                            this.out(item.tryGetProperty('pre'), listItem, item.tryGetProperty('post'));
                      };// end for each in CSL

                      //end for

                      //if newLineIncluded # prettier generated code
                      

                      //if newLineIncluded # prettier generated code
                      if (newLineIncluded) {
                      
                            //rawOut.startNewLine
                            rawOut.startNewLine();
                      };
                  };
              }
              //if item.hasProperty('CSL')
              
              else if ((comment=item.tryGetProperty('COMMENT'))) {
              

                  //if no .lexer or .lexer.options.comments #comments level > 0
                  if (!this.lexer || this.lexer.options.comments) {
                  

                      //# prepend // if necessary
                      //if type of item isnt 'string' or not comment.startsWith("//"), rawOut.put "// "
                      if (typeof item !== 'string' || !(comment.startsWith("//"))) {rawOut.put("// ")};
                      //.out comment
                      this.out(comment);
                  };
              }
              //else if item.tryGetProperty('COMMENT') into var comment:string
              
              else if ((header=item.tryGetProperty('h')) !== undefined) {
              
                  //rawOut.setHeader header
                  rawOut.setHeader(header);
              }
              //else if item.tryGetProperty('h') into var header:number isnt undefined
              
              else {
                  //.sayErr "ASTBase method out Map|Object: unrecognized keys: #{item.allPropertyNames()}"
                  this.sayErr("ASTBase method out Map|Object: unrecognized keys: " + (item.allPropertyNames()));
              };
          }
          //else if item instanceof Object
          
          else {
              //rawOut.put item.toString() # try item.toString()
              rawOut.put(item.toString());
          };

          //end if

        //end loop, next item
          
        };// end for each in Array.prototype.slice.call(arguments)

        //end loop, next item


     //     helper method outInfoLineAsComment(lineInx)
        
     }// ---------------------------
     ASTBase.prototype.outInfoLineAsComment = function(lineInx){

//out line, using comment chars form the target lang (js & c: "//")

        //.lexer.infoLines[lineInx].outAsComment .lexer.outCode
        this.lexer.infoLines[lineInx].outAsComment(this.lexer.outCode);
     }// ---------------------------
     ASTBase.prototype.outPreviousComments = function(){

//out previous lines with comments

        //if no .sourceLineNum, return // if undefined or 0
        if (!this.sourceLineNum) {return};

        //search CODE line, immediatly previous to this
        //var prevCODElineInx = .lexer.getPrevCODEInfoLineIndex(.sourceLineNum)
        var prevCODElineInx = this.lexer.getPrevCODEInfoLineIndex(this.sourceLineNum);

        //search line previous to this (any type)
        //var endAtInx = .lexer.getInfoLineIndex(.sourceLineNum-1)
        var endAtInx = this.lexer.getInfoLineIndex(this.sourceLineNum - 1);

        // print in-between lines (comments & blank lines)
        //for lineInx=prevCODElineInx+1 to endAtInx
        var _end1=endAtInx;
        for( var lineInx=prevCODElineInx + 1; lineInx<=_end1; lineInx++) {
            //.outInfoLineAsComment lineInx
            this.outInfoLineAsComment(lineInx);
        };// end for lineInx
        
     }// ---------------------------
     ASTBase.prototype.outSourceLinesAsComment = function(upTo, fromLineNum){

        //if no .lexer.options.comments, return
        if (!this.lexer.options.comments) {return};

        //default fromLineNum = .sourceLineNum // this statement
        if(fromLineNum===undefined) fromLineNum=this.sourceLineNum;
        //default upTo = .sourceLineNum // this statement
        if(upTo===undefined) upTo=this.sourceLineNum;

        //var startAtInx = .lexer.getInfoLineIndex(fromLineNum)
        var startAtInx = this.lexer.getInfoLineIndex(fromLineNum);
        //var endAtInx = .lexer.getInfoLineIndex(upTo)
        var endAtInx = this.lexer.getInfoLineIndex(upTo);

        //for lineInx=startAtInx to endAtInx
        var _end2=endAtInx;
        for( var lineInx=startAtInx; lineInx<=_end2; lineInx++) {
            //.outInfoLineAsComment lineInx
            this.outInfoLineAsComment(lineInx);
        };// end for lineInx
        
     }// ---------------------------
     ASTBase.prototype.addSourceMap = function(mark){

        //.lexer.outCode.addCompleteSourceMap mark, .sourceLineNum
        this.lexer.outCode.addCompleteSourceMap(mark, this.sourceLineNum);
     }// ---------------------------
     ASTBase.prototype.levelIndent = function(){
//show indented messaged for debugging

        //var indent = 0
        var indent = 0;
        //var node = this
        var node = this;
        //while node.parent into node
        while((node=node.parent)){
            //indent += 2 //add 2 spaces
            indent += 2;
        };// end loop

        //return String.spaces(indent)
        return String.spaces(indent);
     }
    // export
    module.exports.ASTBase = ASTBase;
    
    // end class ASTBase
// -----------
// Module code
// -----------


    //end class ASTBase
    
// end of module
module.exports=ASTBase;
//# sourceMappingURL=ASTBase.js.map
