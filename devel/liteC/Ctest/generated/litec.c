#include "litec.h"
//-------------------------
//Module litec
//-------------------------
//helper tempvars for 'or' expressions short-circuit evaluation
any __or1,__or2,__or3,__or4;
var litec_VERSION, litec_BUILD_DATE;
var litec_usage;
var litec_args;
var litec_mainModuleName, litec_compileAndRunOption, litec_compileAndRunParams;
var litec_options;
any litec_startCompilation(DEFAULT_ARGUMENTS); //forward declare
// ##LiteC
// This is the command line interface to LiteScript Compiler,
// when it is generated as a standalone executable (from generated C source code)

    //global import fs, path

    //import color, ControlledError
    //import OptionsParser  

    //import GeneralOptions, Compiler, ASTBase

    //function startCompilation
    any litec_startCompilation(DEFAULT_ARGUMENTS){ try{

        //Compiler.compileProject(mainModuleName, options);
        Compiler_compileProject(undefined,2,(any_arr){litec_mainModuleName, litec_options});

// Compile Exception handler

        //exception err
        
        }catch(err){

            //if err instance of ControlledError
            if (_instanceof(err,ControlledError))  {
                //console.error color.red, err.message, color.normal
                console_error(undefined,3,(any_arr){color_red, PROP(message_,err), color_normal});
                //process.exit 1
                process_exit(undefined,1,(any_arr){any_number(1)});
            }
            //else if err.code is 'EISDIR'
            
            else if (__is(PROP(code_,err),any_str("EISDIR")))  {
                //console.error '#{color.red}ERROR: "#{mainModuleName}" is a directory#{color.normal}'
                console_error(undefined,1,(any_arr){_concatAny(5,(any_arr){color_red, any_str("ERROR: \""), litec_mainModuleName, any_str("\" is a directory"), color_normal})});
                //console.error 'Please specify a *file* as the main module to compile'
                console_error(undefined,1,(any_arr){any_str("Please specify a *file* as the main module to compile")});
                //process.exit 2
                process_exit(undefined,1,(any_arr){any_number(2)});
            }
            //else 
            
            else {
                //console.error 'UNCONTROLLED ERROR:'
                console_error(undefined,1,(any_arr){any_str("UNCONTROLLED ERROR:")});
                //console.error err
                console_error(undefined,1,(any_arr){err});
                //console.error err.stack
                console_error(undefined,1,(any_arr){PROP(stack_,err)});
                //process.exit 3
                process_exit(undefined,1,(any_arr){any_number(3)});
            };
        };
    return undefined;
    }

//-------------------------
void litec__moduleInit(void){
    litec_VERSION = any_str("0.8.1");
    litec_BUILD_DATE = any_str("2014-07-18T19:45:23.835Z");
    litec_usage = _concatAny(5,(any_arr){any_str("\n    LiteScript-C v"), litec_VERSION, any_str(" "), litec_BUILD_DATE, any_str("\n\n    Usage: litec main.lite.md [options]\n\n    options are:\n    -o dir           output dir. Default is './out'\n    -v, -verbose     verbose level, default is 0 (0-3)\n    -w, -warning     warning level, default is 1 (0-1)\n    -comments        comment level on generated files, default is 1 (0-2)\n    -version         print LiteScript version & exit\n\n    Advanced options:\n    -D FOO -D BAR    Defines preprocessor names (#ifdef FOO/#ifndef BAR)\n    -d, -debug       enable full compiler debug logger file at 'out/debug.logger'\n")});
    litec_args = new(OptionsParser,1,(any_arr){process_argv});
    litec_options = new(GeneralOptions,0,NULL);
    //print JSON.stringify(process.argv)
    print(1,(any_arr){JSON_stringify(undefined,1,(any_arr){process_argv})});
    //if args.option('h','help') 
    if (_anyToBool(METHOD(option_,litec_args)(litec_args,2,(any_arr){any_str("h"), any_str("help")})))  {
        //print usage
        print(1,(any_arr){litec_usage});
        //process.exit 0
        process_exit(undefined,1,(any_arr){any_number(0)});
    };
    //if args.option('vers','version') 
    if (_anyToBool(METHOD(option_,litec_args)(litec_args,2,(any_arr){any_str("vers"), any_str("version")})))  {
        //print VERSION
        print(1,(any_arr){litec_VERSION});
        //process.exit 0
        process_exit(undefined,1,(any_arr){any_number(0)});
    };
    //if args.valueFor('r','run') into mainModuleName
    if (_anyToBool((litec_mainModuleName=METHOD(valueFor_,litec_args)(litec_args,2,(any_arr){any_str("r"), any_str("run")}))))  {
        //compileAndRunOption = true
        litec_compileAndRunOption = true;
        //compileAndRunParams = args.items.splice(args.lastIndex) #remove params after --run
        litec_compileAndRunParams = __call(splice_,PROP(items_,litec_args),1,(any_arr){PROP(lastIndex_,litec_args)});// #remove params after --run
    };
    //with options
    var litec__with1=litec_options;
        //.outDir  = path.resolve(args.valueFor('o') or './out') //output dir
        PROP(outDir_,litec__with1) = path_resolve(undefined,1,(any_arr){(_anyToBool(__or1=METHOD(valueFor_,litec_args)(litec_args,1,(any_arr){any_str("o")}))? __or1 : any_str("./out"))}); //output dir
        //.verboseLevel = parseInt(args.valueFor('v',"verbose") or 0) 
        PROP(verboseLevel_,litec__with1) = parseInt(undefined,1,(any_arr){(_anyToBool(__or2=METHOD(valueFor_,litec_args)(litec_args,2,(any_arr){any_str("v"), any_str("verbose")}))? __or2 : any_number(0))});
        //.warningLevel = parseInt(args.valueFor('w',"warning") or 1)
        PROP(warningLevel_,litec__with1) = parseInt(undefined,1,(any_arr){(_anyToBool(__or3=METHOD(valueFor_,litec_args)(litec_args,2,(any_arr){any_str("w"), any_str("warning")}))? __or3 : any_number(1))});
        //.comments= parseInt(args.valueFor('comment',"comments") or 1) 
        PROP(comments_,litec__with1) = parseInt(undefined,1,(any_arr){(_anyToBool(__or4=METHOD(valueFor_,litec_args)(litec_args,2,(any_arr){any_str("comment"), any_str("comments")}))? __or4 : any_number(1))});
        //.debugEnabled = args.option('d',"debug") 
        PROP(debugEnabled_,litec__with1) = METHOD(option_,litec_args)(litec_args,2,(any_arr){any_str("d"), any_str("debug")});
        //.defines = []
        PROP(defines_,litec__with1) = new(Array,0,NULL);
    ;
    //while args.valueFor('D') into var newDef
    var litec_newDef=undefined;
    while(_anyToBool((litec_newDef=METHOD(valueFor_,litec_args)(litec_args,1,(any_arr){any_str("D")})))){
        //options.defines.push newDef
        __call(push_,PROP(defines_,litec_options),1,(any_arr){litec_newDef});
    };// end loop
    //if no args.items.length
    if (!_length(PROP(items_,litec_args)))  {
        //console.error "Missing file.lite.md to compile\nlite -h for help"
        console_error(undefined,1,(any_arr){any_str("Missing file.lite.md to compile\nlite -h for help")});
        //process.exit 
        process_exit(undefined,0,NULL);
    };
    //if args.items.length>1
    if (_length(PROP(items_,litec_args)) > 1)  {
        //print "Invalid arguments:", args.items.join(' ')
        print(2,(any_arr){any_str("Invalid arguments:"), __call(join_,PROP(items_,litec_args),1,(any_arr){any_str(" ")})});
        //print "lite -h for help"
        print(1,(any_arr){any_str("lite -h for help")});
        //process.exit 2
        process_exit(undefined,1,(any_arr){any_number(2)});
    };
    //mainModuleName = args.items[0]
    litec_mainModuleName = ITEM(0,PROP(items_,litec_args));
    //if options.verboseLevel > 1
    if (_anyToNumber(PROP(verboseLevel_,litec_options)) > 1)  {
            //"""
        print(1,(any_arr){_concatAny(10,(any_arr){any_str("compiler version: "), Compiler_version, any_str(" "), Compiler_buildDate, any_str("\ncompiler options: \n"), litec_options, any_str("\ncwd: "), process_cwd(undefined,0,NULL), any_str("\ncompile: "), litec_mainModuleName})});
        //if options.debugEnabled 
        if (_anyToBool(PROP(debugEnabled_,litec_options)))  {
            //print color.yellow,"GENERATING COMPILER DEBUG AT out/debug.logger",color.normal
            print(3,(any_arr){color_yellow, any_str("GENERATING COMPILER DEBUG AT out/debug.logger"), color_normal});
        };
    };
    //startCompilation
    litec_startCompilation(undefined,0,NULL);
};