var help = {

"help":
`displays the description of a function.
It takes only one argument: the thing you need help about.
▶ help: thing`,

"name":
`turns a block into a name, if possible.
▶ name: block`,

"number":
`turns a block into a number, if possible.
▶ number: block`,

"boolean":
`turns a block into a boolean, if possible.
▶ boolean: block`,

"join":
`outputs a block which contains the contents of its inputs.
▶ join: block block`,

"sentence":
`outputs a block which contains the contents of its inputs, separated by a space.
▶ sentence: block block`,

"fput":
`outputs a block equal to its second input with one extra member, the first input, at the beginning. The second input must be a block.
▶ fput: thing block`,

"lput":
`outputs a block equal to its second input with one extra member, the first input, at the end. The second input must be a block.
▶ lput: thing block`,

"reverse":
`outputs a block whose members are the members of the input block, in reverse order.
▶ reverse: block`,

"gensym":
`outputs a unique word each time it's invoked. The words are of the form G#46, G#47, ...etc.
▶ gensym;`,

"first":
`outputs the first character of a name if the input is a name, or the first member of a block if the input is a block.
▶ first: thing`,

"firsts":
`outputs a block containing the FIRST of each member of the input block.  It is an error if any member of the input list is empty. The input itself may be empty, in which case the output is also empty.
▶ firsts: block`,

"butfirst":
`outputs a name containing all but the first character of the input if the input is a name, or a block containing all but the first member of the input if the input is a block.
▶ butfirst: thing`,

"butfirsts":
`outputs a block containing the BUTFIRST of each member of the input block. It is an error if any member of the input block is empty.
▶ butfirsts: block`,

"last":
`outputs the last character of a name if the input is a name, or the last member of a block if the input is a block.
▶ last: thing`,

"lasts":
`outputs a block containing the LAST of each member of the input block.  It is an error if any member of the input list is empty. The input itself may be empty, in which case the output is also empty.
▶ lasts: block`,

"butlast":
`outputs a name containing all but the last character of the input if the input is a name, or a block containing all but the last member of the input if the input is a block.
▶ butlast: thing`,

"butlasts":
`outputs a block containing the BUTLAST of each member of the input block. It is an error if any member of the input block is empty.
▶ butlasts: block`,

"item":
`outputs the nth character of a name if the second input is a name, or the nth member of a block, if the second input is a block. Index number starts at 1.
▶ item: number thing`,

"pick":
`outputs a randomly chosen member of a block if the input is a block, or a randomly chosen character of a name if the input is a name.
▶ pick: thing`,

"remove":
`outputs a copy of the block where every member equal to the thing is removed.
▶ remove: thing block`,

"remdup":
`outputs a copy of a block with duplicate members removed.  If two or more members of the input are equal, the leftmost of those members is the one that remains in the output.
▶ remdup: block`,
};